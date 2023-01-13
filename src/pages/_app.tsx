import type { AppProps, AppContext } from 'next/app'
import { Provider } from 'mobx-react'
import refreshStore from '@/store/Refresh'
// import netStore from '@/store/Net'
import * as Sentry from '@sentry/nextjs'
import '../styles/globals.scss'
import day from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import { useRouter } from 'next/router'
day.extend(relativeTime)
day.extend(utc)

const isDev = process.env.NODE_ENV === 'development'

function MyApp({ Component, pageProps }: AppProps) {
  const { locale } = pageProps || {}
  const router = useRouter()
  if (locale) {
    require(`dayjs/locale/${locale}.js`)
    day.locale(locale)
  }
  const getLayout = (Component as any).getLayout || ((page: JSX.Element) => page)

  return <Provider refreshStore={refreshStore}>{getLayout(<Component {...pageProps} />)}</Provider>
}
// only run in server side
MyApp.getInitialProps = async ({ Component, ctx }: AppContext) => {
  let pageProps: { [key: string]: any } = {}
  try {
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }
    return { pageProps }
  } catch (err) {
    !isDev && Sentry.captureException(err)
    return { ...pageProps }
  }
}

export default MyApp
