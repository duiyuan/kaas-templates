import React from 'react'
import { FC, CSSProperties } from 'react'
import cs from 'classnames'

interface IProps {
  style?: CSSProperties

  // 外层className
  wrapperClassName?: string | string[]

  className?: string | string[]
}

const LoadingSteps: FC<IProps> = (props) => {
  const { style, wrapperClassName, className } = props

  const wrapperClass = cs('loading-steps', {
    [`${wrapperClassName}`]: !!wrapperClassName,
  })

  const selfClass = cs('step', {
    [`${className}`]: !!className,
  })
  return (
    <div className={wrapperClass} style={style}>
      <div className={selfClass}></div>
      <div className={selfClass}></div>
      <div className={selfClass}></div>
    </div>
  )
}

export default LoadingSteps
