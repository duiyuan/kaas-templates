import React, { FC, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import classnames from 'classnames'

import { Alert } from '@/components/ui/Alert'
import { getMsg } from '@/utils'

const Home_: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div
      id='home-page'
      className={classnames(['home-page'])}
      ref={containerRef}
    >
      <Alert value={getMsg('Home!')} size={'normal'} sticky />
      <h2 style={{ color: '#ffffff' }}>Home Page</h2>
    </div>
  )
}

Home_.displayName = 'Home'

export const Home = observer(Home_)
