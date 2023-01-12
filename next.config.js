const webpack = require('webpack')
// const withCsv2json = require('./config/next-csv2json.js')
const { NODE_ENV, NEXT_PUBLIC_SITE_ENV } = process.env
// const withImg = require('./config/next-img')
const isProd = !!NODE_ENV && NODE_ENV.toLocaleLowerCase() === 'production' && NEXT_PUBLIC_SITE_ENV !== 'test'
const { version } = require('./package.json')
const { withSentryConfig } = require('@sentry/nextjs')
const fs = require('fs')
const hasSentryrc = fs.existsSync('./.sentryclirc')

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore
  include: ['.next'],
  ignore: ['node_modules', 'next.config.js'],
  configFile: '.sentryclirc',
  silent: true, // Suppresses all logs
  urlPrefix: '~/_next',
  release: version,
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
}

module.exports = nextconfig =>
  withSentryConfig(
    {
      ...nextconfig,
      webpack(config, options) {
        config.plugins.push(
          ...[
            new webpack.DefinePlugin({
              'process.env.SENTRY_RELEASE': version,
            }),
          ],
        )

        return config
      },
      assetPrefix: '',
      poweredByHeader: false,
      sentry: {
        widenClientFileUpload: hasSentryrc,
        disableServerWebpackPlugin: !hasSentryrc,
        disableClientWebpackPlugin: !hasSentryrc,
      },
    },
    sentryWebpackPluginOptions,
  )
