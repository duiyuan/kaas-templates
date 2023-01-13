import NextErrorComponent from 'next/error'
import * as Sentry from '@sentry/nextjs'
import { NextPageContext, NextPage } from 'next'

const isDev = process.env.NODE_ENV === 'development'

interface Props {
  statusCode: number
  err?: any
}

const MyError: NextPage<Props> = ({ statusCode, err }: Props) => {
  return <NextErrorComponent statusCode={statusCode} err={err} />
}

MyError.getInitialProps = ({ res, err }: NextPageContext): Props => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : null
  if (statusCode !== 200) {
    !isDev && Sentry.captureException(err)
  }
  return { statusCode: Number(statusCode), err }
}

export default MyError
