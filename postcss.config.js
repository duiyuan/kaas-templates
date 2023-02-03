const { useTailwind } = require('./scripts/constant')

module.exports = {
  // Necessary for external CSS imports to work
  // https://github.com/facebook/create-react-app/issues/2677
  ident: 'postcss',
  config: false,
  plugins: !useTailwind
    ? [
        'postcss-flexbugs-fixes',
        [
          'postcss-preset-env',
          {
            autoprefixer: {
              flexbox: 'no-2009',
            },
            stage: 3,
          },
        ],
        // Adds PostCSS Normalize as the reset css with default options,
        // so that it honors browserslist config in package.json
        // which in turn let's users customize the target behavior as per their needs.
        'postcss-normalize',
      ]
    : [
        'tailwindcss',
        'postcss-flexbugs-fixes',
        [
          'postcss-preset-env',
          {
            autoprefixer: {
              flexbox: 'no-2009',
            },
            stage: 3,
          },
        ],
      ],
}
