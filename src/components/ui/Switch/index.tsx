// https://github.com/react-component/switch

import React from 'react'
import RcSwitch from 'rc-switch'

type SwitchChangeEventHandler = (
  checked: boolean,
  event:
    | React.MouseEvent<HTMLButtonElement>
    | React.KeyboardEvent<HTMLButtonElement>
) => void

type SwitchClickEventHandler = SwitchChangeEventHandler

interface SwitchProps
  extends Omit<
    React.HTMLAttributes<HTMLButtonElement>,
    'onChange' | 'onClick'
  > {
  classnames?: string
  prefixCls?: string
  disabled?: boolean
  checkedChildren?: React.ReactNode
  unCheckedChildren?: React.ReactNode
  onChange?: SwitchChangeEventHandler
  onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>
  onClick?: SwitchClickEventHandler
  tabIndex?: number
  checked?: boolean
  defaultChecked?: boolean
  loadingIcon?: React.ReactNode
  style?: React.CSSProperties
  title?: string
  forwardRef?: React.Ref<any>
}

export default function Switch(props: SwitchProps) {
  return <RcSwitch {...props} />
}
