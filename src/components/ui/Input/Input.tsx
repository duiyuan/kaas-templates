import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
  FC,
} from 'react'
import cs from 'classnames'
import {
  ITextAreaProps,
  BasicInputProps,
  InputProps,
  states,
} from './interface'
import { CSSProperties } from 'styled-components'

const BasicInput: FC<BasicInputProps> = (props, ref) => {
  const {
    prefixelement = null,
    subfixelement = null,
    noticeelement = null,
    inputElement,
    value,
    className,
    containerClassName,
    title,
    height,
    width,
  } = props

  const style: CSSProperties = {
    height: typeof height === 'number' ? `${height}px` : height,
    width: typeof width === 'number' ? `${width}px` : width,
  }

  return (
    <div className={cs('basic-input', className)} style={style}>
      {title && <div className='basic-input-title'>{title}</div>}
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

export const Input = /* FC<InputProps> */ React.forwardRef<
  HTMLInputElement,
  InputProps
>((props, ref) => {
  const {
    onChange,
    onBlur,
    onFocus,
    title,
    height,
    width,
    iserror,
    className,
    noticeelement,
    subfixelement,
    prefixelement,
    containerclass,
    value,
    controlledValue,
    ...restProps
  } = props
  const [innerValue, setInnerValue] = useState<string | number | undefined>('')
  const [state, setState] = useState(props.state ? props.state : states.blur)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInnerValue(e.target.value)
    onChange && onChange(e.target.value)
  }
  const handleFocus = (e: any) => {
    setState(states.focused)
    onFocus && onFocus()
    // setSelectionRange
    // TODO: 需要定位到所有字符后面
  }

  const handleBlur = () => {
    setState(states.blur)
    onBlur && onBlur()
  }

  useEffect(() => {
    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'undefined'
    ) {
      setInnerValue(value)
    }
  }, [value])

  return (
    <BasicInput
      value={controlledValue ? value : innerValue}
      subfixelement={subfixelement}
      prefixelement={prefixelement}
      noticeelement={noticeelement}
      className={className}
      title={title}
      height={height}
      width={width}
      containerClassName={cs('basic-input-container', containerclass, {
        [`basic-input-container-${state}`]: true,
        ['basic-input-container-error']: iserror,
      })}
      inputElement={
        <input
          ref={ref}
          {...restProps}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={
            controlledValue
              ? value
              : innerValue /* TODO: 这里可以对input的值进行处理 */
          }
        ></input>
      }
    ></BasicInput>
  )
})
Input.defaultProps = {
  value: '',
}

/**
 * @description 基于Basic-input开发的input-area组件
 * @description:
 *  - 是否允许输入 - 允许自定义
 *  - 单词之间的距离 - 允许自定义
 *  - wrapper样式 - 允许自定义默认status focused error blur
 *  - size (rows, cols)
 *  - 最大内容长度 - 允许自定义
 *  - 是否展示字数 (暂时先不实现)
 *  - onBlur
 *  - onPressEnter
 *  - onResize (暂时不实现)
 *  - 没有prefix 和 subfix
 */
export const InputArea = React.forwardRef<HTMLTextAreaElement, ITextAreaProps>(
  (props, ref) => {
    const {
      onChange,
      onBlur,
      iserror,
      onResize,
      onPressEnter,
      onFocus,
      size,
      height,
      width,
      title,
      rootClassName,
      readOnly,
      value,
      noticeelement,
      ...restProps
    } = props
    const [innerValue, setInnerValue] = useState<string | number | undefined>(
      ''
    )
    const [state, setState] = useState(props.state ? props.state : states.blur)

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInnerValue(e.target.value)
      onChange && onChange(e.target.value)
    }
    const handleFocus = (e: React.FocusEvent) => {
      if (readOnly) return
      setState(states.focused)
      onFocus && onFocus()
      // setSelectionRange
      // TODO: 需要定位到所有字符后面
    }

    const handleBlur = () => {
      if (readOnly) return
      setState(states.blur)
      onBlur && onBlur()
    }

    const handleKeyPress = (event: React.KeyboardEvent) => {
      // if (event.key === 'Enter') {
      //   onPressEnter && onPressEnter(event)
      // }
      onPressEnter && onPressEnter(event)
    }

    useEffect(() => {
      if (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'undefined'
      ) {
        setInnerValue(value)
      }
    }, [value])

    return (
      <BasicInput
        value={innerValue}
        title={title}
        height={height}
        width={width}
        className={props.className}
        noticeelement={noticeelement}
        containerClassName={cs(
          'basic-input-container',
          'basic-input-container-textarea',
          props.containerclass,
          {
            [`basic-input-container-${state}`]: true,
            ['basic-input-container-error']: Boolean(iserror),
          }
        )}
        inputElement={
          <textarea
            ref={ref}
            {...restProps}
            rows={size?.rows}
            cols={size?.cols}
            className={cs({
              [`${rootClassName}`]: Boolean(rootClassName),
            })}
            onKeyPress={handleKeyPress}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            readOnly={readOnly}
            value={innerValue}
          ></textarea>
        }
      ></BasicInput>
    )
  }
)

InputArea.displayName = 'InputArea'
