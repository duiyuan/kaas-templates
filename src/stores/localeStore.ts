import { makeAutoObservable, runInAction } from 'mobx'

export class LocaleStore {
  public currentLocale = 'en' // 所在地区
  public currentLocaleMessage: Map<string, string> = new Map() // 所在地区语言map

  constructor() {
    makeAutoObservable(this)
  }

  async setCurrentLocale(currentLocale: string) {
    try {
      const response = await fetch(`./_locales/${currentLocale}/messages.json`)
      const result = await response.json()
      console.log('response', response)
      console.log('response', result)
      runInAction(() => {
        this.currentLocale = currentLocale
        this.currentLocaleMessage = result
      })
    } catch (e) {
      console.log('error', e)
    }
  }
}
export const store = new LocaleStore()
