import type { CSSProperties, ReactElement, ReactNode } from 'react'
import { Step } from './index'

export interface IStepProps extends Omit<IStepsProps, 'children'> {
  title?: string | ReactNode

  description?: string | ReactNode
  /* 禁止点击 */
  disable?: boolean

  id: any

  icon?: ReactNode

  index?: number

  onClick?: (index: number, id: any) => void

  disabled?: boolean
}

export interface IStepsProps {
  style?: CSSProperties

  className?: string | string[]
  /* 节点样式 */
  type?: 'default' | 'dot'

  size?: 'default' | 'small'

  direction?: 'vertical' | 'horizontal' /* 暂时还没用到 */

  current?: number /* 这个是从1开始的 */

  status?: 'wait' | 'process' | 'finish' | 'error'
  /* 步骤点击回调 */
  onChange?: (index: number, id: any) => void
  /* 是否显示连接线 */
  lineless?: boolean

  children: ReactElement[] /* TODO: 之后需要加上step类型约束，如果children不是step就报错 */

  showInnerNumber?: boolean
}
