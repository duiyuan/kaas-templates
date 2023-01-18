import React, { Children, useEffect, useMemo } from 'react'
import type { FC, ReactElement } from 'react'
import { IStepProps, IStepsProps } from './interface'
import cs from 'classnames'

export const Step: FC<IStepProps> = (props) => {
  const {
    type,
    index,
    icon,
    style,
    className,
    status,
    current,
    onClick,
    disabled,
    description,
    id,
    title,
    lineless,
    showInnerNumber,
  } = props

  let currentStatus = ''

  /* 多重if-else判断，这样写比较直观 */
  do {
    if (status) {
      currentStatus = status
    }
    if (!current || !index) {
      break
    }
    if (current < index) {
      currentStatus = 'wait'
      break
    }
    if (current === index) {
      currentStatus = 'process'
      break
    }
    if (current > index) {
      currentStatus = 'finish'
      break
    }
  } while (false)

  const classNames = cs('step-item', `step-item-${currentStatus}`, className)

  const renderIconNode = (currentStatus: string) => {
    if (type === 'dot') {
      return null
    }

    let content: any = showInnerNumber ? index : ''

    if (icon) {
      content = icon
    } else if (currentStatus === 'finish') {
      /* TODO: 缺组件 */
      content = icon
    } else if (currentStatus === 'error') {
      /* TODO: 缺组件 */
      content = icon
    }

    return <div className={'step-item-icon'}>{content}</div>
  }

  const onClickStep = () => {
    onClick && !disabled && current !== index && onClick(index || 1, id)
  }

  const iconNode = renderIconNode(currentStatus)

  const itemContent = (title || description) && (
    <div className={'step-item-content'}>
      {title && <div className={'step-item-title'}>{title}</div>}
      {description && (
        <div className={'step-item-description'}>{description}</div>
      )}
    </div>
  )

  const linelessClass = cs({
    ['step-item-lineless']: lineless,
    ['step-item-lineless-active']: lineless && currentStatus === 'finish',
  })

  const itemLineless = lineless && <div className={linelessClass}></div>

  return (
    <li style={style} className={classNames} onClick={onClickStep}>
      {iconNode}
      {itemLineless}
      {itemContent}
    </li>
  )
}

Step.displayName = 'Step'

export const Steps: FC<IStepsProps> = (props) => {
  const {
    children,
    type,
    size,
    lineless,
    style,
    className,
    current,
    status,
    onChange,
  } = props

  const classnames = cs(
    'steps',
    `steps-size-${size}`,
    {
      [`steps-type-${type}`]: type !== 'default' /* 兼容新增的type */,
      ['steps-lineless']: lineless,
    },
    className
  )

  return (
    <ol style={style} className={classnames}>
      {children
        .filter(
          (child: ReactElement) =>
            child &&
            child.type &&
            (child.type as { displayName?: string }).displayName === 'Step'
        )
        .map((step: ReactElement, index) => {
          index += 1
          if (step) {
            const stepProps = {
              type,
              size,
              current,
              index,
              status: current === index ? status : undefined,
              onClick: onChange,
              lineless,
              ...step.props,
            }
            return React.cloneElement(step as ReactElement, stepProps)
          }
          return null
        })}
    </ol>
  )
}

Steps.displayName = 'Steps'

Steps.defaultProps = {
  current: 1,
  type: 'default',
  size: 'default',
  status: 'finish',
}
