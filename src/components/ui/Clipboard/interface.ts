import React from 'react'

export interface ClipboardProps extends StyleComponent {
  children: React.ReactChild
  onCopy?: (text: string) => void
  content: string
  duration?: number
}
