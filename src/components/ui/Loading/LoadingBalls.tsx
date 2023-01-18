import React from 'react'
import { FC, CSSProperties } from 'react'
import cs from 'classnames'

interface IProps {
  style?: CSSProperties

  // 外层className
  wrapperClassName?: string | string[]

  className?: string | string[]
}

const LoadingBalls: FC<IProps> = (props) => {
  const { style, wrapperClassName, className } = props

  const wrapperClass = cs('loading-balls', {
    [`${wrapperClassName}`]: !!wrapperClassName,
  })

  const selfClass = cs('ball', {
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

export default LoadingBalls
