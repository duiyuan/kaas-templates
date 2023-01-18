const path = require('path')
const fs = require('fs')

const PROJECT_PATH = process.cwd() // path.resolve(__dirname, '../')
const PROJECT_NAME = path.parse(PROJECT_PATH).name
const SERVER_HOST = '127.0.0.1'
const SERVER_PORT = 9500

// Source maps are resource heavy and can cause out of memory issue for large source files.
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false'

const useTailwind = fs.existsSync(path.join(PROJECT_PATH, 'tailwind.config.js'))

module.exports = {
  PROJECT_NAME,
  PROJECT_PATH,
  SERVER_HOST,
  SERVER_PORT,
  useTailwind,
  shouldUseSourceMap,
  PAGES: ['popup' /* 'background', */],
}
