const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const WebExtension = require('webpack-target-webextension')
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent')
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const i18nGenerator = require('../plugins/i18nGenerator')

const { PROJECT_PATH, shouldUseSourceMap, PAGES } = require('../constant')
const getStyleLoaders = require('../tools/get-loaders')
const { getClientEnvironment } = require('../tools/utils')
const createEnvironmentHash = require('../tools/hash')
const paths = require('../paths')

const imageInlineSizeLimit = parseInt(
  process.env.IMAGE_INLINE_SIZE_LIMIT || '1'
)
const env = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1))

const cssRegex = /\.css$/
const cssModuleRegex = /\.module\.css$/
const sassRegex = /\.(scss|sass)$/
const sassModuleRegex = /\.module\.(scss|sass)$/

module.exports = function (webpackEnv = 'development') {
  const isEnvDevelopment = webpackEnv === 'development'
  const isEnvProduction = webpackEnv === 'production'
  const isEnvProductionProfile =
    isEnvProduction && process.argv.includes('--profile')

  const entries = PAGES.reduce(
    (prev, entry) => {
      prev[entry] = path.resolve(PROJECT_PATH, `./src/${entry}.tsx`)
      return prev
    },
    {
      // background: path.resolve(PROJECT_PATH, './src/background/index.ts'),
    }
  )

  return {
    name: 'popup',
    // target: ['browserslist'],
    mode: isEnvProduction ? 'production' : isEnvDevelopment && 'development',

    // Stop compilation early in production
    bail: isEnvProduction,

    // https://webpack.docschina.org/configuration/stats/#root
    stats: 'minimal',

    devtool: isEnvProduction
      ? shouldUseSourceMap
        ? 'source-map'
        : false
      : isEnvDevelopment && 'cheap-module-source-map',

    // entry
    entry: entries,

    output: {
      filename: '[name].js',
      path: path.resolve(PROJECT_PATH, './dist'),
    },

    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.json'],
      alias: {
        '@': path.resolve(PROJECT_PATH, './src'),
        Src: path.resolve(PROJECT_PATH, './src'),
        Component: path.resolve(PROJECT_PATH, './src/components'),
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
        // This is only used in production mode
        new CssMinimizerPlugin(),
      ],
    },
    plugins: [
      // Makes some environment variables available in index.html.
      // The public URL is available as %PUBLIC_URL% in index.html, e.g.:
      // <link rel="icon" href="%PUBLIC_URL%/favicon.ico">
      // It will be an empty string unless you specify "homepage"
      // in `package.json`, in which case it will be the pathname of that URL.
      new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),

      // Makes some environment variables available to the JS code, for example:
      // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
      // It is absolutely essential that NODE_ENV is set to production
      // during a production build.
      // Otherwise React will be compiled in the very slow development mode.
      new webpack.DefinePlugin(env.stringified),

      // Watcher doesn't work well if you mistype casing in a path so we use
      // a plugin that prints an error when you attempt to do this.
      // See https://github.com/facebook/create-react-app/issues/240
      isEnvDevelopment && new CaseSensitivePathsPlugin(),
      isEnvProduction &&
        new MiniCssExtractPlugin({
          // Options similar to the same options in webpackOptions.output
          // both options are optional
          filename: 'css/[name].css',
          chunkFilename: 'css/[name].chunk.css',
        }),

      // Moment.js is an extremely popular library that bundles large locale files
      // by default due to how webpack interprets its code. This is a practical
      // solution that requires the user to opt into importing specific locales.
      // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
      // You can remove this if you don't use Moment.js:
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      }),

      // Generate an asset manifest file with the following content:
      // - "files" key: Mapping of all asset filenames to their corresponding
      //   output file so that tools can pick it up without having to parse
      //   `index.html`
      // - "entrypoints" key: Array of files which are included in `index.html`,
      //   can be used to reconstruct the HTML if necessary
      // new WebpackManifestPlugin({
      //   fileName: 'asset-manifest.json',
      //   publicPath: paths.publicUrlOrPath,
      //   generate: (seed, files, entrypoints) => {
      //     const manifestFiles = files.reduce((manifest, file) => {
      //       manifest[file.name] = file.path
      //       return manifest
      //     }, seed)
      //     entrypoints.main.filter((fileName) => !fileName.endsWith('.map'))
      //     return {
      //       files: manifestFiles,
      //       entrypoints: entrypointFiles,
      //     }
      //   },
      // }),
      new HtmlWebpackPlugin({
        template: path.resolve(PROJECT_PATH, './templates/index.html'),
        filename: 'popup.html',
        cache: false,
        inject: true,
        chunks: ['popup'],
        // Nerver minify
        minify: true
          ? false
          : {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,
              minifyJS: true,
              minifyCSS: true,
              minifyURLs: true,
            },
      }),

      // isEnvDevelopment &&
      //   new WebExtension({
      //     // Remove this if you're not using mini-css-extract-plugin.
      //     weakRuntimeCheck: true,
      //     background: {
      //       entry: 'background',
      //       // !! Add this to support manifest v3
      //       manifest: 3,
      //     },
      //   }),

      // isEnvDevelopment && new ReactRefreshPlugin(),

      new CopyPlugin({
        patterns: [
          { from: 'public', to: './' },
          { from: 'images', to: './images' },
        ],
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
                /**
                 * 自动写入i8n
                 * 1.填写locals参数来配置生成多少多少个语言文件
                 * 2.已有内容不会更新，可手动更新或者删除
                 * 3.默认生成添加en语言包，key从getMsg函数的第一个参数获取，且会过滤掉空格和其他非法字符
                 * 4.可以使用$1,$2占位符来动态插入内容，比如getMsg('hellow $1', ['world']) => hello world
                 * 5. 删除多余不使用的key（因为有cache,所以只在yarn i18n-clear命令下才生效）
                 * */
                plugins: [[i18nGenerator, { locals: ['en', 'zh'] }]],
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
            // "url" loader works like "file" loader except that it embeds assets
            // smaller than specified limit in bytes as data URLs to avoid requests.
            // A missing `test` is equivalent to a match.
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              type: 'asset',
              parser: {
                dataUrlCondition: {
                  maxSize: imageInlineSizeLimit,
                },
              },
              generator: {
                filename: 'images/[name][ext]',
              },
            },
            {
              test: [/\.ttf$/, /\.woff2?$/],
              type: 'asset',
              parser: {
                dataUrlCondition: {
                  maxSize: imageInlineSizeLimit,
                },
              },
              generator: {
                filename: 'fonts/[name][ext]',
              },
            },
            {
              test: /\.svg$/,
              use: [
                {
                  loader: require.resolve('@svgr/webpack'),
                  options: {
                    prettier: false,
                    svgo: false,
                    svgoConfig: {
                      plugins: [{ removeViewBox: false }],
                    },
                    titleProp: true,
                    ref: true,
                  },
                },
                {
                  loader: require.resolve('file-loader'),
                  options: {
                    name: 'assets/[name].[ext]',
                  },
                },
              ],
              issuer: {
                and: [/\.(ts|tsx|js|jsx|md|mdx)$/],
              },
            },
            // "postcss" loader applies autoprefixer to our CSS.
            // "css" loader resolves paths in CSS and adds assets as dependencies.
            // "style" loader turns CSS into JS modules that inject <style> tags.
            // In production, we use MiniCSSExtractPlugin to extract that CSS
            // to a file, but in development "style" loader enables hot editing
            // of CSS.
            // By default we support CSS Modules with the extension .module.css
            {
              test: cssRegex,
              exclude: cssModuleRegex,
              use: getStyleLoaders(
                {
                  importLoaders: 1,
                  sourceMap: isEnvProduction
                    ? shouldUseSourceMap
                    : isEnvDevelopment,
                  modules: {
                    mode: 'icss',
                  },
                },
                '',
                isEnvProduction
              ),
              // Don't consider CSS imports dead code even if the
              // containing package claims to have no side effects.
              // Remove this when webpack adds a warning or an error for this.
              // See https://github.com/webpack/webpack/issues/6571
              sideEffects: true,
            },
            {
              test: cssModuleRegex,
              use: getStyleLoaders(
                {
                  importLoaders: 1,
                  sourceMap: isEnvProduction
                    ? shouldUseSourceMap
                    : isEnvDevelopment,
                  modules: {
                    mode: 'local',
                    getLocalIdent: getCSSModuleLocalIdent,
                  },
                },
                '',
                isEnvProduction
              ),
            },
            // Opt-in support for SASS (using .scss or .sass extensions).
            // By default we support SASS Modules with the
            // extensions .module.scss or .module.sass
            {
              test: sassRegex,
              exclude: sassModuleRegex,
              use: getStyleLoaders(
                {
                  importLoaders: 3,
                  sourceMap: isEnvProduction
                    ? shouldUseSourceMap
                    : isEnvDevelopment,
                  modules: {
                    mode: 'icss',
                  },
                },
                'sass-loader',
                isEnvProduction
              ),
              // Don't consider CSS imports dead code even if the
              // containing package claims to have no side effects.
              // Remove this when webpack adds a warning or an error for this.
              // See https://github.com/webpack/webpack/issues/6571
              sideEffects: true,
            },
            // Adds support for CSS Modules, but using SASS
            // using the extension .module.scss or .module.sass
            {
              test: sassModuleRegex,
              use: getStyleLoaders(
                {
                  importLoaders: 3,
                  sourceMap: isEnvProduction
                    ? shouldUseSourceMap
                    : isEnvDevelopment,
                  modules: {
                    mode: 'local',
                    getLocalIdent: getCSSModuleLocalIdent,
                  },
                },
                'sass-loader',
                isEnvProduction
              ),
            },
            {
              test: /\.po$/i,
              use: ['json-loader', 'po2json'],
            },
            // "file" loader makes sure those assets get served by WebpackDevServer.
            // When you `import` an asset, you get its (virtual) filename.
            // In production, they would get copied to the `build` folder.
            // This loader doesn't use a "test" so it will catch all modules
            // that fall through the other loaders.
            {
              // Exclude `js` files to keep "css" loader working as it injects
              // its runtime that would otherwise be processed through "file" loader.
              // Also exclude `html` and `json` extensions so they get processed
              // by webpacks internal loaders.
              exclude: [/^$/, /\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
              type: 'asset/resource',
              generator: {
                filename: '[name][ext]',
              },
            },
          ],
        },
      ].filter((rule) => Boolean(rule)),
    },
    resolveLoader: {
      modules: [path.join(process.cwd(), 'scripts/loaders'), 'node_modules'],
    },
  }
}
