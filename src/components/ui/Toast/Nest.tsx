import * as React from 'react'
import clazz from 'classnames'

export interface NestToastProps extends StyleComponent {
  text: string
  type?: 'error'
}

const NestToast: React.FunctionComponent<NestToastProps> = (props) => {
  const { className, text, type, ...rest } = props
  return (
    <div
      className={clazz([
        className,
        { error: type === 'error' },
        'ui-wallet-toast-nest',
      ])}
      {...rest}
    >
      <span dangerouslySetInnerHTML={{ __html: text }}></span>
    </div>
  )
}

export default NestToast
