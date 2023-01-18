import React, { ReactElement, useContext, useRef } from 'react'
import { useRoutes } from 'react-router-dom'
import routes from '@/routes/routes'
import { observer } from 'mobx-react-lite'
import '@/styles/index.scss'
import './static/iconfont.css'

const Index = (): ReactElement => {
  // const keyController = useRef<KeyController>(new KeyController())
  const appRef = useRef<HTMLDivElement>(null)

  const element = useRoutes(routes)

  return (
    <div className='app' ref={appRef}>
      {element}
    </div>
  )
}
export default observer(Index)
