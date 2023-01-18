import React from 'react'
import { useSearchParams } from 'react-router-dom'

const { useEffect, useState } = React

export default function useQuery(name: string) {
  const [search] = useSearchParams()
  const [value, setValue] = useState<string | null>()

  useEffect(() => {
    const v = search.get(name)
    setValue(v)
  }, [search.get(name)])

  return value
}
