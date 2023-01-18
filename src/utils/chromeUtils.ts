/**
 * Remove current window and all tabs inside it
 */
export async function closeCurrentWindow(): Promise<void> {
  const win = await chrome.windows.getCurrent()
  return chrome.windows.remove(win.id!)
}
