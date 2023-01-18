// https://www.npmjs.com/package/rc-tooltip
import React from 'react'
import RCTooltip from 'rc-tooltip'
import clss from 'classnames'
import { TooltipProps } from 'rc-tooltip/lib/Tooltip'

export interface Props extends TooltipProps {
  children?: JSX.Element
  text?: string
  hideArrow?: boolean // 隐藏三角形
}

const Tooltip = ({ children, text, hideArrow, ...props }: Props) => {
  return (
    <RCTooltip
      prefixCls={clss({ 'hide-arrow': hideArrow }, 'ex-tooltip')}
      {...props}
    >
      <span className='tooltip-container' style={{ fontSize: 'inherit' }}>
        {children || text}
      </span>
    </RCTooltip>
  )
}

export default Tooltip
