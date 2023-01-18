import React, { useContext, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { BackgroundEvent } from '@/utils/constants'
import rootContext from '../context/rootContext'

const ProtectedRoute = ({
  children,
}: {
  children: JSX.Element
}): JSX.Element => {
  const [loading, setLoading] = useState(true)
  const [isLock, setIsLock] = useState(true)
  const { register } = useContext(rootContext)

  useEffect(() => {
    const fn = register(BackgroundEvent.CHECK_IS_LOCK, undefined, (res) => {
      setIsLock(res.response)
      setLoading(false)
    })
    fn()
  }, [register])

  return loading ? <></> : isLock ? <Navigate to='/login' replace /> : children
}

export default ProtectedRoute
