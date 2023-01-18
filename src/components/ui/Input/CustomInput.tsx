import React, {
  InputHTMLAttributes,
  useState,
  FC,
  ReactNode,
  ReactElement,
} from 'react'
import cs from 'classnames'
import styled from 'styled-components'
import { states } from './interface'

export type ValidorItem = {
  func: (value: string) => boolean | Promise<boolean>
  error: string
}

export interface InputProps
  extends Omit<BasicInputProps, 'inputElement'>,
    Omit<InputHTMLAttributes<HTMLElement>, 'onChange' | 'value'> {
  onFocus?: () => void
  onChange?: (value: string) => void
  onBlur?: () => void
  iserror?: number
  state?: keyof typeof states
  containerclass?: string
  validor?: ValidorItem[]
  range?: number[]
  onlyInterger?: boolean
  // onValid?: (value: string, noPassed?: ValidorItem) => void
}

export interface BasicInputProps extends StyleComponent {
  prefixelement?: ReactNode
  subfixelement?: ReactNode
  noticeelement?: ReactNode
  inputElement: ReactElement
  value: string
  disabled?: boolean
  readOnly?: boolean
  /* 包裹所有元素的 className */
  containerClassName?: string
  /* 标题 */
  title?: string
  height?: number | string | undefined
  width?: number | string | undefined
}

const BasicInput: FC<BasicInputProps> = (props, ref) => {
  const {
    prefixelement = null,
    subfixelement = null,
    noticeelement = null,
    inputElement,
    className,
    containerClassName,
    title,
    height,
    width,
  } = props

  const style: React.CSSProperties = {
    height: typeof height === 'number' ? `${height}px` : height,
    width: typeof width === 'number' ? `${width}px` : width,
  }

  return (
    <div className={cs('basic-input', className)} style={style}>
      <div className='basic-input-title'>{title}</div>
      <div className={containerClassName}>
        {prefixelement && (
          <div className='basic-input-prefix-element'>{prefixelement}</div>
        )}
        {inputElement}
        {subfixelement && (
          <div className='basic-input-subfix-element'>{subfixelement}</div>
        )}
      </div>
      {noticeelement && (
        <div className='basic-input-notice-element'>{noticeelement}</div>
      )}
    </div>
  )
}

interface InputState {
  errorText: string
  state: states
}

export class Input extends React.Component<InputProps, InputState> {
  state = {
    errorText: '',
    state: states.blur,
  }

  setErrorText = (err: string) => {
    this.setState({
      errorText: err,
    })
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const { range, onlyInterger } = this.props

    if (Array.isArray(range) && range.length > 0) {
      const [min, max = Number.MAX_SAFE_INTEGER] = range
      if (onlyInterger && /\D$/.test(value)) {
        return false
      }
      if (parseFloat(value) > max || parseFloat(value) < min) {
        return false
      }
    }

    this.props?.onChange?.(value)
  }

  handleFocus = () => {
    this.setState({
      state: states.focused,
      errorText: '',
    })
  }

  doValid = async (showError = true): Promise<boolean> => {
    const { validor, value } = this.props
    const innerValue = value

    if (Array.isArray(validor)) {
      let errorItem: undefined | ValidorItem
      for (let i = 0; i < validor.length; i += 1) {
        const item = validor[i]
        const failed = await item.func(innerValue)
        if (failed) {
          showError && this.setErrorText(item.error)
          errorItem = item
          break
        }
      }
      if (!errorItem) {
        showError && this.setErrorText('')
      }
      return !errorItem
    }
    return true
  }

  handleBlur = async () => {
    this.setState({
      state: states.blur,
    })
    this.props?.onBlur?.()
    this.doValid()
  }

  render() {
    const {
      onChange,
      onBlur,
      title,
      height,
      width,
      className,
      noticeelement,
      subfixelement,
      prefixelement,
      containerclass,
      validor,
      onlyInterger,
      value,
      // onValid,
      ...restProps
    } = this.props

    const { errorText, state } = this.state
    return (
      <BasicInput
        value={value}
        subfixelement={subfixelement}
        prefixelement={prefixelement}
        noticeelement={errorText}
        className={cs([className, { 'basic-input-space': errorText }])}
        title={title}
        height={height}
        width={width}
        containerClassName={cs('basic-input-container', containerclass, {
          [`basic-input-container-${state}`]: true,
          ['basic-input-container-error']: errorText,
        })}
        inputElement={
          <input
            {...restProps}
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            value={value}
          />
        }
      />
    )
  }
}

const StyledTick = styled.div`
  .tick {
    margin-right: 20px;
    img {
      width: 15px;
    }
  }
`

export function Tick() {
  return (
    <StyledTick>
      <div className='tick'>
        <img src='/images/checked.png' alt='' />
      </div>
    </StyledTick>
  )
}
