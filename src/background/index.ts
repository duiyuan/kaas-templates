import json from 'json-bigint'

import ProviderError from './ProviderError'
import { StandardCode } from './ErrorMaker'

const background = 'background'

const JsonToObj = (params: string) => {
  try {
    return json.parse(params)
  } catch (error) {
    console.error('Exception ' + error)
  }
}

const stringify = (obj: { [key: string]: any }) => {
  try {
    return json.stringify(obj)
  } catch (error) {
    console.error('Exception ' + error)
    return new ProviderError({
      code: StandardCode.Parse_Error,
    }).toJson()
  }
}

// // 响应心跳包
const keeplive = (port: chrome.runtime.Port, count: number) => {
  const tick = count + 1
  const data = {
    method: 'pong',
    response: { count: tick },
  }
  const formatedData = stringify(data)
  port.postMessage(formatedData)
  // console.log('keeplive pong', new Date(), tick)
}

chrome.runtime.onConnect.addListener(async (port) => {
  console.log('Service Worker Connected .....')

  port.onMessage.addListener(async (message) => {
    const { method, params } = JsonToObj(message)

    if (method === 'ping') {
      keeplive(port, params.count)
      return false
    }

    const msg = stringify({ method })
    port.postMessage(msg)
  })

  port.onDisconnect.addListener(async () => {
    console.log('Service Worker Disconnect')
  })
})

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
  }
})

chrome.runtime.onUpdateAvailable.addListener((details) => {
  // chrome.runtime.reload()
})

// Handle outer message which come from content-script and others out of wallet
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { method, params } = message

  console.log('[background receive]', message)
  // return true indiacate that you wish to send a response asynchronously
  // https://stackoverflow.com/questions/44056271/chrome-runtime-onmessage-response-with-async-await
  return true
})

// chrome.runtime.onSuspend.addListener(() => {
//   console.error('chrome onSuspend')
//   const contentScript = ports.contentScriptPort()
//   if (contentScript) {
//     contentScript.postMessage(makeEventResponse('suspend', {}))
//   }
// })

export default background
