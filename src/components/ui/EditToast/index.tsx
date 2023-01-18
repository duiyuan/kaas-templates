import React from 'react'
import styled from 'styled-components'
import * as ReactDOM from 'react-dom'

type ToastProps = {
  text: string
  delay?: number
}
const ToastBox = styled.div`
  position: fixed;
  top: 72px;
  left: 50%;
  padding: 12px 20px;
  border-radius: 8px;
  color: #ffffff;
  background: #ebb851;
  animation: scaleShow 0.5s forwards;
  transition: transform 0.2s ease-in-out;
  transform-origin: left;
  z-index: 999;
  font-size: 16px;
  @keyframes scaleShow {
    0% {
      transform: scale(0) translateX(-50%);
    }
    60% {
      transform: scale(1.2) translateX(-50%);
    }
    100% {
      transform: scale(1) translateX(-50%);
    }
  }
`
const Toast = (opt: ToastProps) => {
  return <ToastBox>{opt.text}</ToastBox>
}

export default function toast(opt: ToastProps) {
  const container = document.createElement('div')
  document.body.appendChild(container)
  ReactDOM.render(<Toast {...opt} />, container)
  setTimeout(() => {
    container && document.body.removeChild(container)
  }, opt.delay || 3000)
}
