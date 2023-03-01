import axios, { AxiosInstance, AxiosPromise, AxiosRequestConfig, AxiosRequestHeaders } from 'axios'
import { filterEmptyParams } from '@/utils'
import toasty from '@/components/base/Toast'
import JSONbig from 'json-bigint'

export interface RequestParams extends AxiosRequestConfig {
  [props: string]: any
}

export default class Fetcher {
  params: RequestParams | undefined
  instance: AxiosInstance

  constructor(params: AxiosRequestConfig = {}) {
    this.params = params
    this.params.baseURL = this.prune(process.env.NEXT_PUBLIC_API_HOST || '') + params.baseURL
    this.instance = axios.create({
      ...params,
      transformResponse: [
        data => {
          try {
            data = JSONbig.parse(data)
          } catch (e) {
            console.log(e)
          }
          return data
        },
      ],
    })
  }

  get context() {
    return this.params?.context
  }

  get ip() {
    return this.context?.ip
  }

  get cookies() {
    return this.context?.cookies || {}
  }

  private shaking = (params: any) => filterEmptyParams(params)

  private prune(url: string) {
    return url.endsWith('/') ? url.slice(0, -1) : url
  }

  private commonRequest<T>(
    service: string,
    options: AxiosRequestConfig = {},
    hideErrorToasty?: boolean,
  ): Promise<CommonResponse<T>> {
    options.params = this.shaking(options.params)
    if (hideErrorToasty) {
      service = service.includes('?') ? service + '&hideErrorToasty' : service + '?hideErrorToasty'
    }
    return this.instance(service, options).then(response => {
      const url = response?.config.url
      const data = response.data
      if (data?.code) {
        if (data?.message && !url?.includes('hideErrorToasty')) {
          toasty.error(data?.message)
        }
        return data
      }
      return data
    })
  }

  get<T>(service: string, options: AxiosRequestConfig = {}, hideErrorToasty?: boolean): Promise<CommonResponse<T>> {
    options.method = 'GET'
    return this.commonRequest(service, options, hideErrorToasty)
  }

  post<T>(service: string, options: AxiosRequestConfig = {}, hideErrorToasty?: boolean): Promise<CommonResponse<T>> {
    options.method = 'POST'
    return this.commonRequest(service, options, hideErrorToasty)
  }
}
