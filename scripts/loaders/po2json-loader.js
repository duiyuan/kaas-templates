const po2json = require('po2json')

module.exports = function (source) {
  this.cacheable && this.cacheable()
  const data = po2json.parse(source, {
    isLoadAll: false,
    format: 'jed1.x',
    'fallback-to-msgid': true,
  })
  if (!data || !data.locale_data || !data.locale_data.messages) {
    return {}
  }
  const result = data.locale_data.messages
  return Object.keys(result).reduce((pValue, cValue) => {
    if (cValue && Array.isArray(result[cValue])) {
      const trans = result[cValue].find((v) => !!v)
      if (!!trans && trans !== cValue) {
        pValue[cValue] = trans
      }
    }
    return pValue
  }, {})
}
