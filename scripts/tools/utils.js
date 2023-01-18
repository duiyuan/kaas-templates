const { access, constants } = require('fs')
const { exec, execSync } = require('child_process')
const path = require('path')
const glob = require('glob')

const existsPromise = function (path) {
  return new Promise(function (resolve, reject) {
    access(path, constants.R_OK | constants.W_OK, (err) => {
      if (err) {
        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
}

const runCommand = function (command, rejectWithStdOut = false) {
  return new Promise((resolve, reject) => {
    exec(
      command,
      {
        encoding: 'utf8',
        cwd: path.resolve(__dirname, '../'),
        maxBuffer: Math.pow(1024, 2) * 5,
      },
      function (error, stdout, stderr) {
        if (error) {
          reject(rejectWithStdOut ? stdout : stderr)
        } else {
          resolve(stdout)
        }
      }
    )
  })
}

const getGlobFiles = (pattern, cwd) => {
  return new Promise((resolve, reject) => {
    glob(pattern, { cwd }, function (err, matches) {
      if (err) {
        reject(err)
      } else {
        resolve(matches)
      }
    })
  })
}

const promiseQueue = (array, func) => {
  return array.reduce((pValue, cValue) => {
    return pValue.then(() => {
      return func(cValue, pValue)
    })
  }, Promise.resolve())
}

const resolveApp = (...args) => path.resolve(process.cwd(), ...args)

const moduleFileExtensions = [
  'web.mjs',
  'mjs',
  'web.js',
  'js',
  'web.ts',
  'ts',
  'web.tsx',
  'tsx',
  'json',
  'web.jsx',
  'jsx',
]

// Resolve file paths in the same order as webpack
const resolveModule = (resolveFn, filePath) => {
  const extension = moduleFileExtensions.find((extension) =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`))
  )

  if (extension) {
    return resolveFn(`${filePath}.${extension}`)
  }

  return resolveFn(`${filePath}.js`)
}

// Grab NODE_ENV and REACT_APP_* environment variables and prepare them to be
// injected into the application via DefinePlugin in webpack configuration.
function getClientEnvironment(publicUrl) {
  const REACT_APP = /^REACT_APP_/i
  const raw = Object.keys(process.env)
    .filter((key) => REACT_APP.test(key))
    .reduce(
      (env, key) => {
        env[key] = process.env[key]
        return env
      },
      {
        NODE_ENV: process.env.NODE_ENV || 'development',
        PUBLIC_URL: publicUrl,
        FAST_REFRESH: process.env.FAST_REFRESH !== 'false',
      }
    )
  // Stringify all values so we can feed into webpack DefinePlugin
  const stringified = {
    'process.env': Object.keys(raw).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key])
      return env
    }, {}),
  }

  return { raw, stringified }
}

module.exports = {
  existsPromise,
  runCommand,
  getGlobFiles,
  promiseQueue,
  resolveApp,
  resolveModule,
  getClientEnvironment,
}
