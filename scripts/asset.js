// https://webpack.docschina.org/api/node/
// https://webpack.docschina.org/configuration/stats

const webpack = require('webpack')
const { errorlog, warnlog, successlog } = require('./tools/logger')

require('./env')

const configFactory = require('./config/webpack.asset.config')
const config = configFactory(
  process.env.NODE_ENV,
  process.env.NODE_CLEAR_I18N === 'true'
)

webpack(config, (err, stats) => {
  if (err) {
    errorlog(err.stack || err)
    if (err.details) {
      errorlog(err.details)
    }
    return
  }

  const info = stats.toJson()

  if (stats.hasErrors()) {
    errorlog(info.errors)
  }

  if (stats.hasWarnings()) {
    info.warnings.forEach((warn) => warnlog(warn.message))
  }

  console.log(
    stats.toString({
      preset: 'minimal',
      assets: false,
      modules: false,
      timings: true,
      chunks: false,
      colors: true,
    })
  )
})
