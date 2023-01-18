import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import RootStoreContext from 'Src/components/context/rootContext'
import classNames from 'classnames'

interface Props {
  value?: string
  children?: ReactNode
}

const Modal: React.FC<Props> = () => {
  const rootStore = useContext(RootStoreContext)

  const [enableTransition, setTransition] = useState(false)
  const [drivedHidden, setdrivedHidden] = useState(true)

  const { isHidden, content, setHidden } = rootStore.appStore

  useEffect(() => {
    if (isHidden) {
      setTransition(false)
      setTimeout(() => {
        setdrivedHidden(true)
      }, 600)
    } else {
      setdrivedHidden(false)
      setTimeout(() => {
        setTransition(true)
      }, 100)
    }
  }, [isHidden])

  const closeModalInSomeCase = (event: React.MouseEvent<HTMLDivElement>) => {
    const element = event.target as HTMLElement
    const modalContent = document.querySelector('.modal-content')
    !modalContent?.contains(element) && setHidden()
  }

  return (
    <div>
      {!drivedHidden ? (
        <div className='modal-container' onClick={closeModalInSomeCase}>
          <div
            className={classNames('modal-content', {
              'modal-content-transition': enableTransition,
            })}
          >
            {content}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default observer(Modal)
