import React, { ButtonHTMLAttributes, CSSProperties, useState } from 'react'
import type { FC, ReactNode } from 'react'
import classnames from 'classnames'
import Loading from 'react-loading'

export enum sizes {
  large = 'large',
  normal = 'normal',
  small = 'small',
}

export enum types {
  primary = 'primary',
  default = 'default',
  danger = 'danger',
}

interface IProp extends ButtonHTMLAttributes<HTMLElement> {
  subfixelement?: ReactNode | HTMLElement
  prefixelement?: ReactNode | HTMLElement
  size?: sizes
  className?: string
  appearence?: types
  loading?: boolean
  onClick?: () => void
  style?: CSSProperties
  eventEmitWhenDisabled?: boolean
}

const Button: FC<IProp> = (props) => {
  const {
    value,
    className,
    prefixelement,
    subfixelement,
    size,
    disabled,
    loading,
    appearence = 'primary',
    style,
    onClick,
    eventEmitWhenDisabled,
    ...restProps
  } = props

  const [mouseDown, setMouseDown] = useState<boolean>(false)

  const handleClick = () => {
    if (eventEmitWhenDisabled) {
      onClick && onClick()
    } else {
      !disabled && onClick && onClick()
    }
    setMouseDown((pre) => {
      return false
    })
  }

  return (
    <div
      className={classnames('button-wrapper', className, {
        [`button-wrapper-size-${size}`]: true,
        [`button-wrapper-type-${appearence}`]: true,
        ['button-wrapper-mouse-down']: mouseDown,
        ['button-wrapper-disabled']: disabled,
        ['button-wrapper-loading']: loading,
      })}
      // onMouseDown={() => setMouseDown(true)}
      onClick={handleClick}
      style={style}
    >
      <div className='button'>
        {prefixelement}
        <button
          {...restProps}
          disabled={disabled}
          className={classnames('button-override ui-center', {
            [`button-${size}`]: true,
          })}
        >
          {loading && (
            <div style={{ marginRight: 5 }}>
              <Loading type='spin' width={22} height={22} color='#fff' />
            </div>
          )}
          {value}
        </button>
        {subfixelement}
      </div>
    </div>
  )
}

export default Button
