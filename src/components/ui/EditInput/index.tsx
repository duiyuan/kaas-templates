import React, { useCallback, useState } from 'react'
import clss from 'classnames'
import styled from 'styled-components'
import { prettyNumber } from '@/utils/string'

const InputStyled = styled.div`
  position: relative;
  &.number {
    position: relative;
    .number-box {
      display: block;
      width: 100%;
      padding: 0 12px;
      height: 48px;
      position: absolute;
      top: 0;
      left: 0;
      line-height: 48px;
      z-index: -1;
      font-weight: 400;
      font-size: 15px;
      color: #ffffff;
    }
    .number-box ~ input {
      color: transparent;
    }
  }
  input {
    height: 48px;
    border: 1px solid #3a3939;
    border-radius: 4px;
    outline: none;
    padding: 0 12px;
    background: transparent;
    font-weight: 400;
    font-size: 15px;
    line-height: 18px;
    color: #ffffff;
    transition: all 2;
    width: 100%;
    &:focus {
      border-color: #e0c286;
      /* & ~ .number-box::after {
        display: inline-block;
        content: '';
        height: 15px;
        width: 1px;
        background: #ffffff;
        animation: opacityA 1s infinite;
      } */
    }
    &.error {
      border-color: #ec404e;
    }
  }
  .error-msg {
    position: absolute;
    top: calc(100% + 4px);
    right: 2px;
    text-align: right;
    color: #ec404e;
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
  }
`
type InputProps<T> = {
  value?: T
  onChange?: (val: T) => void
  onBlur?: () => void
  className?: string
  type?: 'number' | 'text'
  maxLength?: number
  error?: string
  placeholder?: string
}
const Input = <T extends string | number>(props: InputProps<T>) => {
  const {
    error,
    type,
    maxLength,
    value,
    onChange,
    onBlur,
    className,
    placeholder,
  } = props
  const isNumber = type === 'number'
  const [showNumber, setShowNumber] = useState(false)

  const handleFocus = useCallback(() => {
    if (isNumber) {
      setShowNumber(false)
    }
  }, [isNumber])

  const handleBlur = useCallback(() => {
    if (isNumber) {
      setShowNumber(true)
    }
    onBlur && onBlur()
  }, [isNumber, onBlur])

  return (
    <InputStyled className={clss({ number: isNumber }, className)}>
      {showNumber && (
        <div className='number-box'>{value && prettyNumber(value)}</div>
      )}
      <input
        placeholder={placeholder}
        className={clss({ error: error })}
        maxLength={maxLength}
        value={value}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onChange={(e) => onChange && onChange(e.target.value as T)}
      />
      {error && <div className='error-msg'>{error}</div>}
    </InputStyled>
  )
}

export default Input
