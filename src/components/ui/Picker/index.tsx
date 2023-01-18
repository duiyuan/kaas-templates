import React, { ReactNode } from 'react'
import styled from 'styled-components'

const StyledDiv = styled.div``

interface Props extends StyleComponent {
  options: any[]
  indicator: (props: any) => React.ReactNode
}

export default function Picker(props: Props) {
  const { ...rest } = props
  return <div className='picker-box' {...rest}></div>
}
