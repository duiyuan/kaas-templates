import React from 'react'
import { getMsg } from '@/utils'
// import Icon from '@/ui/Icon'
import styled from 'styled-components'

interface ViewMoreProps extends StyleComponent {
  onClick: () => void
  disabled?: boolean
}

const StyledBox = styled.div`
  font-weight: 500;
  text-align: center;
  color: #a3a3a3;
  font-size: 16px;
  cursor: pointer;
  padding: 5px 0 15px;
  text-align: center;
  text-decoration: underline;
  line-height: 19px;
`

export default function ViewMore(props: ViewMoreProps) {
  const { onClick } = props
  return (
    <StyledBox onClick={onClick}>
      {/* <Icon type='eye' /> */}
      {getMsg('View More')}
    </StyledBox>
  )
}
