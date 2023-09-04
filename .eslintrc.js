// https://github.com/prettier/eslint-config-prettier/blob/main/CHANGELOG.md#version-800-2021-02-21

module.exports = {
  extends: ['@kaas-devteam/eslint-config'],
  rules: {
    '@typescript-eslint/no-this-alias': 'off',
    quotes: [
      'error',
      'single',
      { avoidEscape: true, allowTemplateLiterals: true },
    ],
  },
}
