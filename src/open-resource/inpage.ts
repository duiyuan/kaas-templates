/**
 * 该脚本文件会被content-script.js注入到前台页面
 * 暴露对象到全局，window.xxx
 * window.xxx 挂载所有跟 content-script.js 通信的方法
 * chrome 的 content-script 不具备修改 website window的能力
 * 必须借助 inpage.js 此类注入到 website page 的脚本
 */

import ee from '@/utils/emiter'
import makeError, { StandardCode } from '@/background/ErrorMaker'

window.addEventListener('message', (e) => {
  const { from, method, result, error, params } = e.data
  const isEvent = method?.startsWith('diox#')

  // 接收来自content-script 的消息，
  // 作为 dioxide.on(event，handler) 的事件触发
  if (isEvent) {
    if (method === 'diox#operationTimeout') {
      const listeners = ee.events
      // 在链接断连后，将未完成的请求(method)全部处理为操作超时
      Object.keys(listeners).forEach((name) => {
        if (name.startsWith('diox_')) {
          const error = makeError(StandardCode.Operation_Timeout, null)
          ee.emit(name, { error }, '', true)
        }
      })
      return
    }
    const emit = ee.emit(method, result)
    console.log(
      `[inpage trigger event(${emit ? 'succeed' : 'failed'})}]`,
      method,
      e.data,
      new Date()
    )
    return
  }

  // 接收来自content-script 的消息，作为 dioxide.request 的响应
  if (from === 'contentscript') {
    const { requestId } = params || {}
    const emit = ee.emit(method, { result, error }, requestId)
    console.log(
      `[inpage trigger event(${emit ? 'succeed' : 'failed'})]`,
      method,
      result,
      new Date()
    )
    return
  }
})

window.contentProxy = {}
