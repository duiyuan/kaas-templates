import { getMsg } from '@/utils'

export const SOCIAL_ERROR = getMsg('Illegal format')

export const SENTRY = {
  dsn: process.env?.REACT_APP_SENTRY_DSN,
  environment: process.env.REACT_APP_SENTRY_ENV,
}

export const IS_PRODUCTION =
  process.env.NODE_ENV?.toLocaleLowerCase() === 'production'
