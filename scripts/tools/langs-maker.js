// https://github.com/lukasgeiter/gettext-extractor#readme
// 提取组件内 所有 gettext 调用，收集 messageid ，生成 .pot
// !Todo

const path = require('path')
const { GettextExtractor, JsExtractors } = require('gettext-extractor')
const { runCommand, existsPromise } = require('./utils')

const resolve = (filepath) => path.resolve(process.cwd(), filepath)

const extractor = new GettextExtractor()
const pattern = resolve('src/**/*.@(ts|js|tsx|jsx)')
const potFilePath = resolve('src/i18n/index.pot')
const langs = ['en', 'zh', 'jp', 'ZhTw']

extractor
  .createJsParser([
    JsExtractors.callExpression('gettext', {
      arguments: { text: 0, context: 1 },
    }),
  ])
  .parseFilesGlob(pattern)

extractor.getMessages().forEach((msg) => {
  msg.references = []
})
extractor.savePotFile(potFilePath)

langs.forEach((lang) => {
  const poFilePath = resolve(`src/i18n/index.${lang}.po`)
  existsPromise(poFilePath)
    .then((flag) => {
      if (flag) {
        runCommand(
          `msgmerge --output-file=${poFilePath} ${poFilePath} ${potFilePath}`
        )
      } else {
        runCommand(
          `msginit --no-translator --input=${potFilePath} --locale=${lang} --output=${poFilePath}`
        )
      }
    })
    .catch((ex) => console.error(ex))
})

extractor.printStats()
