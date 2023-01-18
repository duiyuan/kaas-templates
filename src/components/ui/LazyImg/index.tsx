import React, { useEffect, useState } from 'react'
import clss from 'classnames'
type Props = {
  defaultUrl?: string
  defaultElement?: JSX.Element
  url?: string
  alt?: string
  className?: string
  cacheKey?: string
}

const localCache: { [key: string]: string } = {}

const LazyImg = (props: Props) => {
  const { defaultElement, defaultUrl, url, className, alt, cacheKey } = props
  const localCacheKey = cacheKey || url
  const localcacheUrl = localCacheKey && localCache[localCacheKey]
  const [cacheUrl, setCacheUrl] = useState('')

  useEffect(() => {
    if (url) {
      if (!(cacheKey && localCache[cacheKey])) {
        const img = new Image()
        img.onload = function (res) {
          setCacheUrl(url)
          if (cacheKey && url) {
            localCache[cacheKey] = url
          }
        }
        img.src = url
      }
    } else {
      setCacheUrl('')
    }
  }, [url, cacheKey, localCache])

  if (url && (cacheUrl || localcacheUrl)) {
    return (
      <img
        className={clss(className, 'object-cover')}
        src={cacheUrl || localcacheUrl}
        alt={alt}
      />
    )
  }
  if (defaultElement) {
    return defaultElement
  }
  if (defaultUrl) {
    return <img className={className} src={defaultUrl} alt='default' />
  }
  return <img src='' alt='defaultUrl or defaultElement is required' />
}

export default LazyImg
