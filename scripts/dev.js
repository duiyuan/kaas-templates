const webpack = require('webpack')
const chalk = require('react-dev-utils/chalk')
const WebpackDevServer = require('webpack-dev-server')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const CompilerEmitPlugin = require('./plugins/CompilerEmitPlugin')
const paths = require('./paths')

require('./env')

const reloadServer = require('./reloadServer')
const { SERVER_PORT, PAGES } = require('./constant')
const configFactory = require('./config/webpack.config')
const createDevServerConfig = require('./config/devserver.config')

const serverConfig = createDevServerConfig({
  onBeforeSetupMiddleware(devServer) {
    reloadServer(devServer.app)
  },
})
const config = configFactory('development')
config.plugins.push(new CleanWebpackPlugin())

const compiler = webpack(config)
const devServer = new WebpackDevServer(serverConfig, compiler)

// Launch WebpackDevServer.
devServer.startCallback(() => {
  console.log(
    chalk.cyan(`Successfully started server on http://127.0.0.1:${SERVER_PORT}`)
  )
})
;['SIGINT', 'SIGTERM'].forEach(function (sig) {
  process.on(sig, function () {
    devServer.close()
    process.exit()
  })
})
