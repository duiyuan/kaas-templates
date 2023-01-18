const fs = require('fs')
const path = require('path')
let locals = [] // generator target
let isClear = false // clear unused key
let oldKeys = {}

const generateJSON = (obj, filepath) => {
  try {
    delete require.cache[require.resolve(filepath)]
    obj = require(filepath)
  } catch (e) {
    obj = {}
  }
  return obj
}

const getObjLen = (obj = {}) => {
  return Object.keys(obj).length
}

const sortObj = (obj = {}) => {
  return Object.keys(obj)
    .sort()
    .reduce((t, c) => {
      t[c] = obj[c]
      return t
    }, {})
}

module.exports = function i18nGenerator() {
  const runtimeKeys = {}
  let t = null
  return {
    pre(state) {
      this.cacheKeysSize = getObjLen(runtimeKeys)
    },
    visitor: {
      StringLiteral(path, state) {
        locals = state.opts.locals || ['en']
        isClear = !!state.opts.isClear
        if (
          path.parent.type === 'CallExpression' &&
          path.parent.callee.name === 'getMsg' &&
          !path.node.hasI18n
        ) {
          const argStr = path.node.value
          const trimStr = argStr.replace(/[^\d\w]/g, '_')
          runtimeKeys[trimStr] = {
            message: argStr,
          }
          path.node.value = trimStr
          path.node.hasI18n = true
          path.skip()
        }
      },
    },
    // 插件遍历结束
    post(state) {
      if (this.cacheKeysSize !== getObjLen(runtimeKeys)) {
        if (t) clearTimeout(t)
        t = setTimeout(function () {
          locals.forEach((local) => {
            const filePath = `${path.resolve(
              '.',
              'public',
              '_locales',
              local,
              'messages.json'
            )}`
            oldKeys[local] = generateJSON(oldKeys[local] || {}, filePath)

            Object.keys({ ...oldKeys[local], ...runtimeKeys }).forEach(
              (oKey) => {
                // unAutoDelete manifest key
                const isExclude = oKey.match('_MANIFEST_')
                if (!runtimeKeys[oKey] && isClear && !isExclude) {
                  delete oldKeys[local][oKey]
                } else if (!oldKeys[local][oKey]) {
                  oldKeys[local][oKey] = runtimeKeys[oKey]
                }
              }
            )
            fs.mkdir(path.dirname(filePath), { recursive: true }, function () {
              fs.writeFileSync(
                filePath,
                JSON.stringify(sortObj(oldKeys[local]), null, 4)
              )
            })
          })
        }, 100)
      }
    },
  }
}
