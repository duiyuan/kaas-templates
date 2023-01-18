import { ReactNode } from 'react'
export interface alertProps {
  /* 消息提示类型, 现在只有info */
  type?: 'success' | 'error' | 'info' | 'warning'
  /* 消息体 */
  value: string | ReactNode | HTMLElement
  /* TODO:icon */
  icon?: ReactNode | HTMLElement
  /* 点击x的cb */
  onClose?: () => void
  /* 去处理的cb */
  onHandle?: () => void
  /* position: sticky */
  sticky?: boolean
  /* className */
  className?: string | string[]
  /* TODO:持续显示时间 1s = 10000*/
  duration?: number

  size: 'small' | 'normal' | 'large'
}
