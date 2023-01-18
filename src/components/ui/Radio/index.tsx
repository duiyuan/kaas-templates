import classNames from 'classnames'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'

const StyledRadio = styled.div`
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  > .spot {
    border: 1px solid #fff;
    height: 18px;
    width: 18px;
    border-radius: 100%;
    position: relative;
    &.checked {
      border-color: var(--color-primary);
      > span {
        background-color: var(--color-primary);
        width: 66.6666%;
        height: 66.6666%;
        border-radius: 100%;
      }
    }
    &.checked ~ h5 {
      color: var(--color-primary);
    }
  }
  h5 {
    font-size: 15px;
    margin: 0 14px;
  }
`

interface Props extends StyleComponent {
  labelText?: string
  label?: React.ReactNode
  checked: boolean
  name: string
  onClick?: (name: string) => void
}

export default function Radio(props: Props) {
  const { labelText, label, name, checked, onClick, ...rest } = props
  // const [value, setValue] = useState(checked)

  const handleClick = () => {
    onClick?.(name)
  }
  return (
    <StyledRadio {...rest} onClick={handleClick}>
      <div className={classNames(['spot ui-center', { checked }])}>
        <span></span>
      </div>
      {labelText && <h5>{labelText}</h5>}
      {label}
    </StyledRadio>
  )
}
