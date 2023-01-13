import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import WrapPage from '@/components/base/Layout/wrap'
import { useCDN } from '@/utils/cdn'
import styled from 'styled-components'
import refreshStore from '@/store/Refresh'
import { observer } from 'mobx-react-lite'

const HomeTotalStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-size: 30px;
  color: #2b89e2;
  .logo {
    width: 100px;
    height: 100px;
  }
`

const Home: CustomPage = () => {
  const refresh = refreshStore.refresh

  const pageLoaded = useRef(false)

  useEffect(() => {
    if (refresh) {
      console.log('refresh')
    }
  }, [refresh])

  return (
    <HomeTotalStyled>
      <img className="logo" src="/img/logo.png" alt="" />
      <p>ssr project</p>
    </HomeTotalStyled>
  )
}

export default WrapPage(observer(Home))
