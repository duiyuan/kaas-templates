import React from 'react'
import styled from 'styled-components'

const StyledSection = styled.div`
  position: relative;
  border-radius: 4px;
  background-color: var(--color-bg-main);
  padding: 20px 15px;
  header {
    font-size: 16px;
    margin: 4px 0 15px;
    padding: 0;
  }
`

interface Props extends StyleComponent {
  title?: string
  children: React.ReactChild
}

export default function EmptyCard(props: Props) {
  const { children, title = '', ...rest } = props
  return (
    <StyledSection {...rest}>
      {title && <header>{title}</header>}
      {children}
    </StyledSection>
  )
}
