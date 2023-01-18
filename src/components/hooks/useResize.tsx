import React, { useState, useEffect, RefObject } from 'react'

export interface Iresize {
  screenWidth: number
  screenHeight: number
  ratiowh: number
  ratiohw: number
  rect?:
    | {
        [key in
          | 'width'
          | 'height'
          | 'left'
          | 'right'
          | 'top'
          | 'bottom']: number
      }
    | undefined
}

export function useResize(element: RefObject<HTMLDivElement>) {
  const [{ screenWidth, screenHeight, ratiowh, ratiohw, rect }, setState] =
    useState<Iresize>({
      screenWidth: 0,
      screenHeight: 0,
      ratiowh: 0,
      ratiohw: 0,
      rect: undefined,
    })

  const onResize = () => {
    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight
    const ratiowh = screenWidth / screenHeight
    const ratiohw = screenHeight / screenWidth

    let rect

    if (element && element.current) {
      const clientRect = element.current.getBoundingClientRect()

      rect = {
        width: clientRect.width,
        height: clientRect.height,
        left: clientRect.left,
        right: clientRect.right,
        top: clientRect.top,
        bottom: clientRect.bottom,
      }
    }

    setState({ screenWidth, screenHeight, ratiowh, ratiohw, rect })
  }

  useEffect(() => {
    window.addEventListener('resize', onResize, false)
    onResize()
    return () => {
      window.removeEventListener('resize', onResize, false)
    }
  }, [])

  return { screenWidth, screenHeight, ratiowh, ratiohw, rect }
}
