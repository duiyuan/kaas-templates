import React from 'react'
import styled from 'styled-components'
import ReactDOM from 'react-dom'
import classnames from 'classnames'

import GoldCard, { Props as GoldCardProps } from '../GoldCard'

const StyledSection = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.3);
  color: #fff;
`

interface Props extends StyleComponent {
  title?: string
  children: React.ReactChild
  goldCardProps?: Omit<GoldCardProps, 'children'>
}

export default function EmptyModal(props: Props) {
  const { children, title = '', goldCardProps = {}, ...rest } = props

  return ReactDOM.createPortal(
    <StyledSection className={classnames([, 'ui-center'])}>
      <GoldCard {...rest} {...goldCardProps}>
        {children}
      </GoldCard>
    </StyledSection>,
    document.querySelector('#portal')!
  )
}
