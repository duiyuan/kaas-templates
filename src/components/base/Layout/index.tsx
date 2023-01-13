import Script from 'next/script'
import { observer } from 'mobx-react'
import Head from 'next/head'
import React from 'react'

const Layout: React.FC = observer(({ children }) => {
  return (
    <>
      <Head>
        {/* <link rel="dns-prefetch" href="//xxxx" /> */}
        <link rel="shortcut icon" href="/img/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=false" />
        {/* <meta name="Description" content="Description" /> */}
        <title>DioScan</title>
      </Head>
      <Script src="/js/icon.min.js" strategy="beforeInteractive"></Script>
      <div className="container"> {children} </div>
    </>
  )
})

export default Layout
