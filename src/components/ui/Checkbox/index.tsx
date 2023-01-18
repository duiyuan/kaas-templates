import React, { useCallback, useMemo, useState } from 'react'
import classnames from 'classnames'

interface Props extends StyleComponent {
  children?: React.ReactNode
  defaultChecked?: boolean
  onChange: (value: boolean) => void
}
export default function Checkbox(props: Props) {
  const { children, defaultChecked, className, onChange, ...rest } = props
  const [checked, setChecked] = useState(defaultChecked)

  const url = useMemo(() => {
    return checked
      ? '/images/checkbox-checked.png'
      : '/images/checkbox-unchecked.png'
  }, [checked])

  const handleChange = useCallback(() => {
    setChecked(!checked)
    onChange?.(!checked)
  }, [checked])

  return (
    <label
      onClick={handleChange}
      className={classnames(['checkbox-wrap', className])}
      {...rest}
    >
      <img src={url} alt='' />
      {children}
    </label>
  )
}
