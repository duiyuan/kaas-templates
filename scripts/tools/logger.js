// const chalk = require('chalk')
const chalk = require('react-dev-utils/chalk')

const errorlog = (message) => console.log(chalk.red(message))
const warnlog = (message) => console.log(chalk.yellow(message))
const successlog = (message) => console.log(chalk.green(message))
const infolog = (message) => console.log(chalk.blue(message))

module.exports = {
  errorlog,
  warnlog,
  successlog,
  infolog,
}
