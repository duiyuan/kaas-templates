import React, { FC, ReactNode, useContext, useEffect, useMemo } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import rootContext from 'Src/components/context/rootContext'
import { observer } from 'mobx-react-lite'
import Icon from 'Src/components/ui/Icon'
import {
  makeConfirmMnemonicLink,
  makeEditAddrConfirmLink,
} from 'Src/utils/link'
/**
 * @description
 * 这个组件设计的时候我想的是有两种使用方法
 * - 作为HOC使用，直接在把component传进来，这个增加的是回到路由上一步的功能
 * - 作为根路由wrapper使用，那么那些title需要使用一个context传入
 */

interface IProps {
  children?: ReactNode
  title?: string
  goBack?: () => void
}

const LayoutWithHeader: FC<IProps> = (props) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { appStore } = useContext(rootContext)

  const handleGoBack = () => {
    return props.goBack ? props.goBack() : navigate(-1)
  }

  const isInAppStoreContext = () => {
    return Boolean(appStore)
  }

  const title = () => {
    if (isInAppStoreContext()) {
      return appStore.headerTitle
    }
    throw new Error('Forbiden')
  }

  const noBackBar = useMemo(() => {
    return [makeConfirmMnemonicLink(), makeEditAddrConfirmLink()].some(
      (url) => location.pathname === url
    )
  }, [location.pathname])

  const noIcon = useMemo(() => {
    return [makeConfirmMnemonicLink()].some((url) => location.pathname === url)
  }, [location.pathname])

  return (
    <div className='layout-with-header-container'>
      {!noBackBar && (
        <div className='header'>
          {!noIcon && (
            <Icon
              size={24}
              type='left'
              className={'back-icon'}
              onClick={handleGoBack}
              linkable
            />
          )}
          <div className='title'>{title()}</div>
        </div>
      )}
      {!isInAppStoreContext() && (
        <div className='layout-with-header-content'>{props.children}</div>
      )}
      <div className='layout-with-header-content'>
        <Outlet />
      </div>
    </div>
  )
}

export default observer(LayoutWithHeader)
