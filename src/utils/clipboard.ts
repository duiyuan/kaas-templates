function createElement<T>(nodeType: string, id: string): T {
  let node = document.querySelector('#' + id) as any
  if (node) {
    return node
  }
  node = document.createElement(nodeType)
  node.id = id
  document.body.appendChild(node)
  // node.classList.add(classname);
  return node
}

export function copyText(text: string) {
  const node = createElement<HTMLInputElement>('input', 'clipboard-copy')
  node.style.cssText = 'position:fixed; right: -1000px'
  node.value = text
  node.focus()
  node.select()
  document.execCommand('copy')
  return true
}

export function getTextFromClipboard() {
  const pasteNode = createElement<HTMLInputElement>('input', 'clipboard-paste')
  pasteNode.value = ''
  pasteNode.style.cssText = 'position:fixed; right: -1000px'
  pasteNode.focus()
  document.execCommand('paste')
  return pasteNode.value
}
