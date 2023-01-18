import * as React from 'react'
import * as ReactDOM from 'react-dom'
import clazz from 'classnames'
import NestToast, { NestToastProps } from './Nest'

export interface ToastProps extends Pick<NestToastProps, 'type'> {
  style?: React.CSSProperties
  content: string
  duration?: number
  nest?: boolean
  wrapper?: HTMLElement
  outclick?: () => void
  onTimeEnd?: () => void
}

interface State {
  content: string
}

export class Toast extends React.PureComponent<ToastProps, State> {
  state = {
    content: this.props.content,
  }

  timer: null | NodeJS.Timeout = null

  changeContent = (content: string) => {
    this.setState({ content })
  }

  handler = (e: any) => this.props?.outclick?.()

  tick = () => {
    const { duration } = this.props
    if (typeof duration !== 'undefined' && duration !== -1) {
      this.timer = setTimeout(() => {
        this.props?.onTimeEnd?.()
      }, duration * 1000)
    }
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer)
    document.body.removeEventListener('click', this.handler)
  }

  componentDidMount() {
    this.tick()
    document.body.addEventListener('click', this.handler, false)
  }

  render() {
    const { content } = this.state
    const { nest = false, type } = this.props
    return (
      <div
        data-role='toast'
        className={clazz([{ nest: !!nest }, 'ui-wallet-toast'])}
        {...this.props}
      >
        <NestToast
          type={type}
          className='ui-wallet-toast-inner'
          text={content}
        />
      </div>
    )
  }
}

const toastMap = new Map()

export default function toasty(props: ToastProps) {
  const {
    duration = 5000,
    wrapper = document.querySelector('#page-sub-layout') || document.body,
    ...rest
  } = props
  const uid = crypto.randomUUID?.() || Date.now()
  const container = document.createElement('div')

  let timer: null | number = null

  const destroy = () => {
    timer && window.clearTimeout(timer)
    container.parentElement?.removeChild(container)
    document.body.removeEventListener('click', toastMap.get(uid), false)
    toastMap.delete(uid)
  }

  toastMap.set(uid, destroy)

  wrapper.appendChild(container)
  ReactDOM.render(<Toast {...rest} />, container)
  container.addEventListener('click', destroy, false)

  if (duration !== -1) {
    timer = window.setTimeout(() => destroy(), duration)
  }
  return destroy
  // return ReactDOM.createPortal(<Toast {...rest} />, document.body)
}
