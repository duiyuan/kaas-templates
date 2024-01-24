import { HttpsProxyAgent } from 'https-proxy-agent'
import BigNumber from 'bignumber.js'
const proxy = process.env.HTTP_PROXY

export const httpAgent = proxy ? new HttpsProxyAgent(proxy) : undefined

const [mqHostname, mqPort] = process.env.MQ_ENDPOINT.split(':')
export const MQ_URL = {
  hostname: mqHostname,
  protocol: 'amqp',
  port: mqPort ? Number(mqPort) : 5672,
  username: process.env.MQ_USER,
  password: process.env.MQ_PASSWORD,
}

export const bignumberMult = (val1: number | string, val2: BigNumber.Value) => {
  return new BigNumber(val1).multipliedBy(val2)
}

export const getTimeDiffDay = (starTime, endTime) => {
  const timeDifference = endTime - starTime

  const daysDifference = timeDifference / (1000 * 60 * 60 * 24)

  return Math.floor(daysDifference)
}
