import React from 'react'
import classnames from 'classnames'
import copy from 'copy-text-to-clipboard'
import { useState } from 'react'

import Icon from '../Icon'

import { CopyTextProps } from './interface'

export default function CopyText(props: CopyTextProps) {
  const {
    children,
    content,
    onCopy,
    duration = 2000,
    className,
    cancelBubble,
    ...rest
  } = props
  const [isCopied, setCopied] = useState(false)

  const handleClick: React.MouseEventHandler = (e) => {
    copy(content.toLocaleLowerCase())
    if (cancelBubble) {
      e.stopPropagation()
    }
    onCopy?.(content)
    setCopied(true)
    setTimeout(() => setCopied(false), duration)
  }

  return (
    <div
      {...rest}
      className={classnames(['ui-flex-start-center', className])}
      onClick={handleClick}
    >
      {children}
      <Icon
        type={isCopied ? 'checked' : 'copy'}
        style={{ marginLeft: 5 }}
        linkable
      />
    </div>
  )
}
