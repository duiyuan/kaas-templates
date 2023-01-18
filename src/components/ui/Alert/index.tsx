import React, { FC, useState } from 'react'
import { alertProps } from './interface'
import cs from 'classnames'
import { CSSProperties } from 'styled-components'
import Icon from '../Icon'

export const Alert: FC<alertProps> = (props) => {
  const [isShown, setShown] = useState<boolean>(true)

  const { className, sticky, value, size, onClose, onHandle, ...rest } = props

  // const style: CSSProperties = {
  //   display: isShown ? 'block' : 'none',
  //   position: sticky ? 'sticky' : 'static',
  //   top: '0px',
  // }

  const handleClose = () => {
    onClose && onClose()
    setShown(false)
  }

  const handleClick = () => {
    onHandle && onHandle()
  }

  const sizeMap = {
    small: 12,
    normal: 24,
    large: 30,
  }

  return (
    <div
      className={cs(
        'alert',
        {
          'alert-sticky': sticky,
          'alert-hide': !isShown,
          [`alert-${size}`]: Boolean(size),
        },
        className
      )}
      {...rest}
    >
      <Icon
        type='cross'
        color='#A3A3A3'
        onClick={handleClose}
        linkable
        size={sizeMap[size]}
      />
      <span className='ui-pointer' onClick={handleClick}>
        {value}
      </span>
      <Icon
        linkable
        type='forward'
        onClick={handleClick}
        size={sizeMap[size]}
      ></Icon>
    </div>
  )
}
