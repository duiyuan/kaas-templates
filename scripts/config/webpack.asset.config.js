const path = require('path')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')

const { PROJECT_PATH, shouldUseSourceMap, PAGES } = require('../constant')
const { getClientEnvironment } = require('../tools/utils')
const createEnvironmentHash = require('../tools/hash')
const paths = require('../paths')

function resolveApp(filename = '') {
  return path.resolve(PROJECT_PATH, 'src', filename)
}

module.exports = function (webpackEnv = 'development') {
  const env = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1))
  const isEnvDevelopment = webpackEnv === 'development'
  const isEnvProduction = webpackEnv === 'production'
  const isEnvProductionProfile =
    isEnvProduction && process.argv.includes('--profile')

  const performance = isEnvProduction
    ? {
        hints: false,
        maxEntrypointSize: 500 * 1024 * 1024,
        maxAssetSize: 500 * 1024 * 1024,
      }
    : {}
  return {
    name: 'extension-scripts',
    // target: ['browserslist'],
    mode: isEnvProduction ? 'production' : isEnvDevelopment && 'development',

    // Stop compilation early in production
    bail: isEnvProduction,

    // https://webpack.docschina.org/configuration/stats/#root
    stats: 'minimal',

    // https://webpack.docschina.org/configuration/devtool/#devtool
    devtool: isEnvProduction
      ? shouldUseSourceMap
        ? 'source-map'
        : false
      : isEnvDevelopment && 'cheap-source-map',

    // entry
    entry: {
      background: path.resolve(PROJECT_PATH, './src/background/index.ts'),
      'content-script': resolveApp('content-script/index.ts'),
      inpage: resolveApp('open-resource/inpage.ts'),
    },

    watch: isEnvDevelopment,

    output: {
      filename: '[name].js',
      path: path.resolve(PROJECT_PATH, './dist'),
    },

    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.json'],
      alias: {
        '@': resolveApp(''),
        Src: resolveApp(''),
      },
    },

    cache: {
      type: 'filesystem',
      version: createEnvironmentHash(env.raw),
      cacheDirectory: paths.appWebpackCache,
      store: 'pack',
      buildDependencies: {
        defaultWebpack: ['webpack/lib/'],
        config: [__filename],
        tsconfig: [paths.appTsConfig],
      },
    },

    infrastructureLogging: {
      appendOnly: true,
      // level: 'verbose',
      level: 'info',
    },

    optimization: {
      minimize: isEnvProduction,
      minimizer: [
        // This is only used in production mode
        new TerserPlugin({
          terserOptions: {
            parse: {
              // We want terser to parse ecma 8 code. However, we don't want it
              // to apply any minification steps that turns valid ecma 5 code
              // into invalid ecma 5 code. This is why the 'compress' and 'output'
              // sections only apply transformations that are ecma 5 safe
              // https://github.com/facebook/create-react-app/pull/4234
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              // Disabled because of an issue with Uglify breaking seemingly valid code:
              // https://github.com/facebook/create-react-app/issues/2376
              // Pending further investigation:
              // https://github.com/mishoo/UglifyJS2/issues/2011
              comparisons: false,
              // Disabled because of an issue with Terser breaking valid code:
              // https://github.com/facebook/create-react-app/issues/5250
              // Pending further investigation:
              // https://github.com/terser-js/terser/issues/120
              inline: 2,
              drop_console: isEnvProduction,
            },
            mangle: {
              safari10: true,
            },
            // Added for profiling in devtools
            keep_classnames: isEnvProductionProfile,
            keep_fnames: isEnvProductionProfile,
            output: {
              ecma: 5,
              comments: false,
              // Turned on because emoji and regex is not minified properly using default
              // https://github.com/facebook/create-react-app/issues/2488
              ascii_only: true,
            },
          },
        }),
      ],
    },
    plugins: [
      new webpack.DefinePlugin(env.stringified),

      // Watcher doesn't work well if you mistype casing in a path so we use
      // a plugin that prints an error when you attempt to do this.
      // See https://github.com/facebook/create-react-app/issues/240
      isEnvDevelopment && new CaseSensitivePathsPlugin(),

      // Moment.js is an extremely popular library that bundles large locale files
      // by default due to how webpack interprets its code. This is a practical
      // solution that requires the user to opt into importing specific locales.
      // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
      // You can remove this if you don't use Moment.js:
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      }),
    ].filter(Boolean),

    module: {
      // makes missing exports an error instead of warning
      // strictExportPresence: true,
      rules: [
        // Handle node_modules packages that contain sourcemaps
        shouldUseSourceMap && {
          enforce: 'pre',
          exclude: /@babel(?:\/|\\{1,2})runtime/,
          test: /\.(js|mjs|jsx|ts|tsx|css)$/,
          loader: require.resolve('source-map-loader'),
        },
        {
          // "oneOf" will traverse all following loaders until one will
          // match the requirements. When no loader matches it will fall
          // back to the "file" loader at the end of the loader list.
          oneOf: [
            // Process application JS with Babel.
            // The preset includes JSX, Flow, TypeScript, and some ESnext features.
            {
              test: /\.(js|mjs|jsx|ts|tsx)$/,
              include: paths.appSrc,
              loader: require.resolve('babel-loader'),
              options: {
                customize: require.resolve(
                  'babel-preset-react-app/webpack-overrides'
                ),
                presets: [
                  [
                    require.resolve('babel-preset-react-app'),
                    { runtime: 'classic' },
                  ],
                ],
                // plugins: [
                //   isEnvDevelopment &&
                //     shouldUseReactRefresh &&
                //     require.resolve('react-refresh/babel'),
                // ].filter(Boolean),
                // This is a feature of `babel-loader` for webpack (not Babel itself).
                // It enables caching results in ./node_modules/.cache/babel-loader/
                // directory for faster rebuilds.
                cacheDirectory: true,
                // See #6846 for context on why cacheCompression is disabled
                cacheCompression: false,
                compact: isEnvProduction,
              },
            },
          ],
        },
      ].filter((rule) => Boolean(rule)),
    },
    performance,
    resolveLoader: {
      modules: [path.join(process.cwd(), 'scripts/loaders'), 'node_modules'],
    },
  }
}
