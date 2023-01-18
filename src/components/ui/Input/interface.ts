import type { InputHTMLAttributes, FC, ReactNode, ReactElement } from 'react'
import React from 'react'
import { CSSProperties } from 'styled-components'

export enum states {
  blur = 'blur',
  focused = 'focused',
}

export interface ITextAreaProps
  extends Omit<
      BasicInputProps,
      'inputElement' | 'prefixelement' | 'subfixelement'
    >,
    Omit<InputHTMLAttributes<HTMLElement>, 'size'> {
  onFocus?: () => void
  onChange?: (e: any) => void
  onPressEnter?: (e: any) => void
  onBlur?: () => void
  onResize?: () => void
  /* 尺寸 */
  size?: { rows?: number; cols?: number }
  /* 允许用户输入的最大字符长度 (Unicode)  */
  maxlength?: number
  /* 直接显示错误状态 */
  iserror?: number | boolean
  /* 输入框状态 */
  state?: keyof typeof states
  /* wrapper 样式 */
  containerclass?: string
  /* 是否展示字数 */
  showCount?: boolean
  /* 直接作用到根元素也就是textarea元素的class */
  rootClassName?: string | string[]
}

export type ValidorItem = {
  func: (value: string) => boolean | Promise<boolean>
  error: string
}

export interface InputProps
  extends Omit<BasicInputProps, 'inputElement'>,
    Omit<InputHTMLAttributes<HTMLElement>, 'onChange'> {
  onFocus?: () => void
  onChange?: (value: string) => void
  onBlur?: () => void
  iserror?: number | boolean
  state?: keyof typeof states
  /*  包含prefixelement 和 input 元素的className*/
  containerclass?: string
  validor?: ValidorItem[]
  controlledValue?: boolean
}

export interface BasicInputProps {
  prefixelement?: ReactNode
  subfixelement?: ReactNode
  noticeelement?: ReactNode
  inputElement: ReactElement
  value?: InputHTMLAttributes<HTMLInputElement>['value']
  disabled?: boolean
  readOnly?: boolean
  /* 包裹所有元素的 className */
  className?: string
  containerClassName?: string

  style?: CSSProperties
  /* 标题 */
  title?: string

  height?: number | string | undefined

  width?: number | string | undefined
}
