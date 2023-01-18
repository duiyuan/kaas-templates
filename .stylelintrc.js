// https://github.com/stylelint/stylelint/blob/main/docs/user-guide/get-started.md

module.exports = {
  extends: ['@duiyuan/stylelint-config'],
  rules: {
    'color-function-notation': null,
    'alpha-value-notation': null,
    'property-no-vendor-prefix': null,
    'selector-class-pattern': null,
  },
  ignoreFiles: ['node_modules/**/*', 'build/**/*'],
}
