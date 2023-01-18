// https://webpack.docschina.org/api/node/

const webpack = require('webpack')
// const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// const ProgressBarPlugin = require('progress-bar-webpack-plugin')

require('./env')

const configFactory = require('./config/webpack.config')
const { errorlog, warnlog, successlog } = require('./tools/logger')

const config = configFactory('production')
// config.plugins.push(new CleanWebpackPlugin(), new ProgressBarPlugin())

const compiler = webpack(config)

compiler.run((err, stats) => {
  compiler.close((closeErr) => {
    if (closeErr) {
      errorlog('closeErr', closeErr)
    }
  })
  // https://webpack.docschina.org/api/node/#error-handling
  if (err) {
    errorlog('err', err.stack || err)
    if (err.details) {
      errorlog(err.details)
    }
    return
  }
  const info = stats.toJson()

  if (stats.hasErrors()) {
    errorlog('stats.hasErrors', info.errors)
    return
  }

  if (stats.hasWarnings()) {
    info.warnings.forEach((warn) => warnlog(warn.message))
    return
  }
  successlog('Build finish')
})
