const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const paths = require("./path");

const getStyleLoaders = (cssOptions, preProcessor, isEnvProduction = false) => {
  const isDev = !isEnvProduction;
  const loaders = [
    isDev && require.resolve("style-loader"),
    isEnvProduction && { loader: MiniCssExtractPlugin.loader },
    {
      loader: require.resolve("css-loader"),
      options: cssOptions,
    },
    {
      // Options for PostCSS as we reference these options twice
      // Adds vendor prefixing based on your specified browser support in package.json
      loader: require.resolve("postcss-loader"),
      options: {
        sourceMap: !isEnvProduction,
      },
    },
  ].filter(Boolean);
  if (preProcessor) {
    loaders.push(
      {
        loader: require.resolve("resolve-url-loader"),
        options: {
          sourceMap: !isEnvProduction,
          root: paths.appRoot,
        },
      },
      {
        loader: require.resolve(preProcessor),
        options: {
          sourceMap: true,
        },
      }
    );
  }
  return loaders;
};

module.exports = getStyleLoaders;
