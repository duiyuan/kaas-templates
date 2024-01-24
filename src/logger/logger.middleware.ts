import { Injectable, NestMiddleware } from '@nestjs/common'
import * as log4js from 'log4js'

log4js.configure({
  appenders: {
    out: {
      type: 'stdout',
    },
    emergencies: {
      type: 'file',
      filename: 'logs/panic.log',
    },
    // See https://log4js-node.github.io/log4js-node/logLevelFilter.html
    errors: {
      type: 'logLevelFilter',
      appender: 'emergencies',
      level: 'error',
    },
    // See https://log4js-node.github.io/log4js-node/dateFile.html
    app: {
      type: 'dateFile',
      filename: 'logs/combined.log',
      pattern: '.yyyy-MM-dd',
      keepFileExt: true,
      daysToKeep: 7,
    },
    // See https://github.com/log4js-node/redis
    // redis: { type: '@log4js-node/redis', channel: 'logs', host: '', port: '', pass: '' }
  },
  categories: {
    kaasApp: { appenders: ['out', 'errors', 'app'], level: 'debug' },
    default: { appenders: ['out', 'errors', 'app'], level: 'debug' },
  },
  // Every process do logging not only master process
  disableClustering: true,
  pm2InstanceVar: 'INSTANCE_ID',
})
export const log = log4js.getLogger(process.env.NAME)

export function logger(req: any, res: any, next: () => void) {
  let args = ''
  try {
    if (Object.keys(req.query).length) {
      args = JSON.stringify(req.query)
    } else if (Object.keys(req.body).length) {
      args = JSON.stringify(req.body)
    } else {
      args = JSON.stringify(req.params)
    }
  } catch (err) {
    args = req.query || req.params || req.body
  }
  log.info(`${req.method}: ${req.url} arg: ${args}`)
  next()
}
