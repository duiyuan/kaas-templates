import React from 'react'

export interface CopyTextProps extends StyleComponent {
  children: React.ReactChild
  onCopy?: (text: string) => void
  content: string
  duration?: number
  cancelBubble?: boolean
}
