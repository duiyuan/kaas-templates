import clss from 'classnames'
import React from 'react'
import styled, { css } from 'styled-components'

export interface IconProps extends StyleComponent {
  type: string
  className?: string
  onClick?: React.MouseEventHandler
  size?: string | number | { [key in 'height' | 'width']: number }
  linkable?: boolean
  disabled?: boolean
  color?: string
  theme?: 'primary' | 'success' | 'error' | 'warn'
}

// const StyledSvg = styled.svg<Pick<Props, 'linkable' | 'disabled'>>`
const StyledSvg = styled.svg`
  vertical-align: middle;
  fill: currentColor;
  overflow: hidden;
  transition: all ease 0.2s;
  padding-top: 1px;
  width: 14px;
  height: 14px;

  ${(props: IconProps) => css`
    cursor: ${props.linkable && !props.disabled ? 'pointer' : 'default'};
  `};
`

const Icon = (props: IconProps) => {
  const {
    type,
    className,
    size,
    onClick,
    linkable,
    disabled,
    theme,
    style = {},
  } = props

  let color = props.color
  if (!color && theme) {
    switch (theme) {
      case 'primary':
        color = 'var(--color-primary)'
        break
      case 'success':
        color = 'var(--color-success)'
        break
      case 'error':
        color = 'var(--color-error)'
        break
      case 'warn':
        color = 'var(--color-warn)'
        break
    }
  }

  let s
  if (typeof size === 'object') {
    s = size
  } else {
    s = size ? { width: size, height: size } : {}
  }

  const styles = Object.assign(style, s, { color })

  return (
    <StyledSvg
      style={styles}
      className={clss(className, 'wallet-font', {
        'cursor-pointer': !!onClick,
      })}
      disabled={disabled}
      type={type}
      theme={theme}
      aria-hidden='true'
      linkable={linkable}
      onClick={(e) => onClick?.(e)}
    >
      <use href={`#wallet-font-${type}`}></use>
    </StyledSvg>
  )
}

export default Icon
