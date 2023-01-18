const path = require('path')
const { PROJECT_PATH, PAGES } = require('./constant')
const i18nGenerator = require('./plugins/i18nGenerator')
const paths = require('./paths')
const chalk = require('react-dev-utils/chalk')
const entry = PAGES.reduce(
  (prev, entry) => {
    prev[entry] = path.resolve(PROJECT_PATH, `./src/${entry}.tsx`)
    return prev
  },
  {
    // background: path.resolve(PROJECT_PATH, './src/background/index.ts'),
  }
)
class ShutdownPlugin {
  apply(compiler) {
    compiler.hooks.shutdown.tap(
      'Successfully clear',
      (
        stats /* stats is passed as an argument when done hook is tapped.  */
      ) => {
        console.log(chalk.cyan('Successfully clear unused i18n key'))
      }
    )
  }
}
module.exports = {
  mode: 'none',
  entry,
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
    alias: {
      '@': path.resolve(PROJECT_PATH, './src'),
      Src: path.resolve(PROJECT_PATH, './src'),
      Component: path.resolve(PROJECT_PATH, './src/components'),
    },
  },
  module: {
    noParse: /\.png$|\.scss$|\.css|\.svg/,
    rules: [
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        include: paths.appSrc,
        loader: require.resolve('babel-loader'),
        options: {
          customize: require.resolve(
            'babel-preset-react-app/webpack-overrides'
          ),
          presets: [
            [require.resolve('babel-preset-react-app'), { runtime: 'classic' }],
          ],
          /**
           * 自动写入i8n
           * 1.填写locals参数来配置生成多少多少个语言文件
           * 2.已有内容不会更新，可手动更新或者删除
           * 3.默认生成添加en语言包，key从getMsg函数的第一个参数获取，且会过滤掉空格和其他非法字符
           * 4.可以使用$1,$2占位符来动态插入内容，比如getMsg('hellow $1', ['world']) => hello world
           * 5. 删除多余不使用的key使用isClear参数(注意：必须是全量编译状态下使用，否则会删除其他的)
           * */
          plugins: [[i18nGenerator, { locals: ['en', 'zh'], isClear: true }]],
          cacheDirectory: false,
          cacheCompression: false,
        },
      },
    ],
  },
  plugins: [new ShutdownPlugin()],
}
