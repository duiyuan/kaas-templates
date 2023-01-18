export function createScript(src: string, remove = true, onload: () => void) {
  const script = document.createElement('script')
  script.src = src
  script.onload = function (this: any) {
    remove && this.remove()
    onload()
  }
  ;(document.head || document.documentElement).appendChild(script)
}

export default function jsonp() {}
