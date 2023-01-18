import React from 'react'
import styled from 'styled-components'
import classnames from 'classnames'

const StyledSection = styled.div<{ borderSize: number }>`
  background-color: #1a1919;
  position: relative;
  &::before {
    position: absolute;
    top: 0;
    height: 40px;
    width: 100%;
    border-radius: 4px;
    content: '';
    background-color: var(--color-primary);
    z-index: 1;
  }
  > .container {
    position: relative;
    top: ${(props) => props.borderSize + 'px'};
    border-radius: 4px;
    padding: 16px;
    background-color: var(--color-bg-main);
    z-index: 2;
  }
`

export interface Props extends StyleComponent {
  borderSize?: number
  children: React.ReactChild
  containerClass?: string
  containerStyle?: React.CSSProperties
}

export default function GoldCard(props: Props) {
  const {
    borderSize = 1,
    containerClass = '',
    containerStyle,
    children,
    ...rest
  } = props
  return (
    <StyledSection {...rest} borderSize={borderSize}>
      <div
        className={classnames(['container', containerClass])}
        style={containerStyle}
      >
        {children}
      </div>
    </StyledSection>
  )
}
