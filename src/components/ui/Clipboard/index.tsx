import React from 'react'
import classnames from 'classnames'
import copy from 'copy-text-to-clipboard'

import { useState } from 'react'

import Icon from '../Icon'

import { ClipboardProps } from './interface'
import { getMsg } from 'Src/utils'

export default function Clipboard(props: ClipboardProps) {
  const {
    children,
    content,
    onCopy,
    duration = 3000,
    className,
    ...rest
  } = props
  const [isCopied, setCopied] = useState(false)

  const handleClick = () => {
    copy(content.toLocaleLowerCase())
    onCopy?.(content)
    setCopied(true)
    setTimeout(() => setCopied(false), duration)
  }

  return (
    <div
      {...rest}
      className={classnames(['clipboard-item'])}
      onClick={handleClick}
    >
      {children}
      <Icon type='copy' className='copy-btn' linkable />
      <div className={classnames('tooltips', isCopied && 'tooltips-success')}>
        {isCopied ? getMsg(' Copied ') : getMsg('Copy to Clipboard')}
      </div>
    </div>
  )
}
