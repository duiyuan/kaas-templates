import Ttip, { Props as TtipProps } from '@/components/base/Tooltip'
import styled from 'styled-components'

const TooltipStyled = styled.div``
interface CToolTipProps extends Omit<TtipProps, 'overlay'> {
  options: React.ReactNode
  target: JSX.Element
}

export default function CToolTip(props: CToolTipProps) {
  const { options, target, ...arg } = props || {}
  return (
    <Ttip
      placement="bottom"
      overlayClassName="popover"
      hideArrow={true}
      overlay={<TooltipStyled className="header-tooltip">{options}</TooltipStyled>}
      {...arg}>
      {target}
    </Ttip>
  )
}
