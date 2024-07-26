import { LocaleType } from '@/i18n/config'
import '../styles/globals.scss'
import day from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import { cookies } from 'next/headers'
import { Metadata } from 'next'
import Script from 'next/script'
import Header from '@/components/base/Layout/Header'
import Footer from '@/components/base/Layout/Footer'
day.extend(relativeTime)
day.extend(utc)

export const metadata: Metadata = {
  title: 'name',
  other: {
    icons: '/img/favicon.ico',
    viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=false',
  },
}
const isDev = process.env.NODE_ENV === 'development'

function Layout({ children }: { children: React.ReactElement }) {
  const cookieStore = cookies()
  const locale: LocaleType = (cookieStore.get('lang')?.value || 'en') as LocaleType

  if (locale) {
    require(`dayjs/locale/${locale}.js`)
    day.locale(locale)
  }
  return (
    <html>
      <body>
        <Header />
        <Script src="/js/icon.min.js" strategy="beforeInteractive"></Script>
        <div className="container"> {children} </div>
        <Footer />
      </body>
    </html>
  )
}

export default Layout
