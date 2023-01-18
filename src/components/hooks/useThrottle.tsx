import debounce from 'lodash/debounce'
import { useEffect, useCallback, useRef } from 'react'

export function useThrottle(cb: () => void, delay: number) {
  const cbRef = useRef(cb)
  // use mutable ref to make useCallback/throttle not depend on `cb` dep
  useEffect(() => {
    cbRef.current = cb
  })
  return useCallback(
    debounce(() => cbRef.current(), delay),
    [delay]
  )
}
