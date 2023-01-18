export function isNull(object: any) {
  return typeof object === null
}

export const throttle = (fn: any, delay: number, ...args: any[]) => {
  let timer: any
  return () => {
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(args)
        clearTimeout(timer)
        timer = null
      }, delay)
    }
  }
}

export const filterEmptyObject = (obj: { [key: string]: any }): any => {
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'object') {
      filterEmptyObject(obj[key])
    }
    if (typeof obj[key] === 'undefined') {
      delete obj[key]
    }
  })
  return obj
}

export const getMsg = (key: string, arg?: string | string[]) => {
  return chrome.i18n.getMessage(key, arg) || key
}
