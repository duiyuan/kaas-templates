import React from 'react'
import ReactDOM from 'react-dom'
import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'
import { HashRouter as Router } from 'react-router-dom'

import 'whatwg-fetch'

import RootContext from './components/context/rootContext'
import { rootStore } from './stores'
import { SENTRY, IS_PRODUCTION } from '@/constant'

import App from './app'

if (SENTRY.environment === 'production') {
  const { dsn, environment } = SENTRY
  Sentry.init({
    dsn: dsn,
    integrations: [new BrowserTracing()],
    environment: environment,
    tracesSampleRate: IS_PRODUCTION ? 1.0 : 0.3,
    debug: false,
  })
}

ReactDOM.render(
  <React.StrictMode>
    <RootContext.Provider value={rootStore}>
      <Router>
        <App />
      </Router>
    </RootContext.Provider>
  </React.StrictMode>,

  document.querySelector('#root')
)
