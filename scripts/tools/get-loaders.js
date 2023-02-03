const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const paths = require('../paths')

const { shouldUseSourceMap } = require('../constant')

const getStyleLoaders = (cssOptions, preProcessor, isEnvProduction = false) => {
  const isDev = !isEnvProduction
  const loaders = [
    isDev && require.resolve('style-loader'),
    isEnvProduction && { loader: MiniCssExtractPlugin.loader },
    {
      loader: require.resolve('css-loader'),
      options: cssOptions,
    },
    {
      loader: 'px2rem-loader',
      options: {
        remUnit: 10,
        remPrecision: 8,
      },
    },
    {
      // Options for PostCSS as we reference these options twice
      // Adds vendor prefixing based on your specified browser support in package.json
      loader: require.resolve('postcss-loader'),
      options: {
        sourceMap: isEnvProduction ? shouldUseSourceMap : isDev,
      },
    },
  ].filter(Boolean)
  if (preProcessor) {
    loaders.push(
      {
        loader: require.resolve('resolve-url-loader'),
        options: {
          sourceMap: isEnvProduction ? shouldUseSourceMap : isDev,
          root: paths.appSrc,
        },
      },
      {
        loader: require.resolve(preProcessor),
        options: {
          sourceMap: true,
        },
      }
    )
  }
  return loaders
}

module.exports = getStyleLoaders
