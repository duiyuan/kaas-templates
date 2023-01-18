import querystring from 'query-string'
import json from 'json-bigint'

import { shakeKeyValue } from '@/utils/string'
import { getLitnodeUrl } from '@/utils/link'

function checkStatus(response: Response) {
  if (response.ok) {
    return response
  } else {
    return Promise.reject(response)
  }
}

export default class Fetcher {
  get api() {
    return this.prune(process.env.REACT_APP_API_HOST || '') + '/api'
  }

  async litenode() {
    return (await getLitnodeUrl()) + '/cmd/'
  }

  prune = (url: string) => (url.endsWith('/') ? url.slice(0, -1) : url)

  get<T>(service: string, options: any): Promise<T> {
    options = { credentials: 'omit', ...options }

    let absoluteUrl = service.startsWith('http') ? service : this.api + service

    if (options.data) {
      const data = shakeKeyValue(options.data) || {}
      absoluteUrl += '?' + querystring.stringify(data, { encode: false })
    }

    return fetch(absoluteUrl, options)
      .then(checkStatus)
      .then((r) => r.text().then((text) => json.parse(text)))
  }

  postToLitenode<T>(
    service: string,
    body: string
  ): Promise<LitenodeResponse<T>> {
    const payload = service + ' ' + body

    return this.litenode().then((litenode) =>
      this.post<LitenodeResponse<T>>(litenode + service, {
        headers: {
          'Content-Type': 'text/plain',
        },
        body: payload,
      })
    )
  }

  post<T>(service: string, options: RequestInit = {}): Promise<T> {
    const { body } = options

    const concatOption: RequestInit = {
      ...options,
      credentials: 'omit',
      method: 'post',
      body,
    }
    const absoluteUrl = service.startsWith('http')
      ? service
      : this.api + (service.startsWith('/') ? service.slice(1) : service)

    return fetch(absoluteUrl, concatOption)
      .then(checkStatus)
      .then((r) => r.json())
  }
}
