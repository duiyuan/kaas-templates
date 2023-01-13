import day from 'dayjs'

export const storage = {
  get(key: string) {
    try {
      const localData = window.localStorage.getItem(key)
      if (localData) {
        if (localData.match(/\{|\[/)) {
          try {
            return JSON.parse(localData)
          } catch (e) {
            return localData
          }
        } else {
          return localData
        }
      }
      return ''
    } catch (err) {
      return ''
    }
  },
  set(key: string, value: any) {
    try {
      if (!key) return
      if (typeof value === 'string') {
        return window.localStorage.setItem(key, value as string)
      }
      if (typeof value === 'object') {
        try {
          return window.localStorage.setItem(key, JSON.stringify(value))
        } catch {
          return window.localStorage.setItem(key, value)
        }
      }
    } catch (err) {
      return
    }
  },
  remove(key: string) {
    try {
      if (!key) return
      window.localStorage.removeItem(key)
    } catch (err) {
      return
    }
  },
}

export const isSever = typeof window === 'undefined'

/**
 * 过滤对象中无值的属性
 * @param params 对象
 * @returns newparams
 */
export const filterEmptyParams = (params: { [propName: string]: any } | undefined) => {
  if (params && typeof params === 'object') {
    Object.keys(params).forEach(key => {
      const val = params[key]
      if (['', undefined, null].includes(val)) {
        delete params[key]
      }
    })
    return params
  }
  return params
}

export const customfromNow = function (val: string | number) {
  const dayTarget = day(val)
  if (!dayTarget.isValid()) return val
  const gapScend = Math.abs(dayTarget.diff(Date.now(), 'second'))
  const gapMinute = Math.abs(dayTarget.diff(Date.now(), 'minute'))
  const gapHour = Math.abs(dayTarget.diff(Date.now(), 'hour'))
  const gapYear = Math.abs(dayTarget.diff(Date.now(), 'year'))
  if (gapYear) return dayTarget.utc().format('YYYY-MM-DD HH:mm')
  if (gapHour > 24) return dayTarget.utc().format('MM-DD HH:mm:ss')
  if (gapMinute === 1) return `${gapMinute || '1'} minute ago`
  if (gapScend < 60) return `${gapScend || '1'} secs ago`
  return dayTarget.fromNow()
}
