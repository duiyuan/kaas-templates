import * as React from 'react'
import styled from 'styled-components'
// import Icon from '../MyIcon'
import clazz from 'classnames'

export interface NestToastProps extends StyleComponent {
  text: string
  type?: 'error'
  showIcon?: boolean
  alpha?: boolean
}

const StyledNestToast = styled.div`
  background-color: #edefff;
  font-size: 15px;
  border-radius: 6px;
  padding: 14px 16px;
  &.alpha {
    border-color: rgba(79, 96, 255, 0.1);
    background-color: rgba(79, 96, 255, 0.1);
  }
  svg {
    margin-right: 8px;
    flex: none;
  }
  span {
    line-height: 22px;
    color: #4f60ff;
  }
  &.error {
    background-color: #f8eeed;
    &.alpha {
      border-color: rgba(187, 83, 79, 0.1);
      background-color: rgba(187, 83, 79, 0.1);
    }
    color: var(--color-text-danger);
    span {
      color: var(--color-text-danger);
    }
  }
`

const NestToast: React.FunctionComponent<NestToastProps> = props => {
  const { className, showIcon = true, text, alpha = false, type, ...rest } = props
  // let iconType = 'kaas-warn-outline'
  return (
    <StyledNestToast className={clazz([className, { error: type === 'error', alpha: alpha }])} {...rest}>
      {/* {showIcon && <Icon size={20} type={iconType} />} */}
      <span dangerouslySetInnerHTML={{ __html: text }}></span>
    </StyledNestToast>
  )
}

export default NestToast
