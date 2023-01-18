import { action, computed, makeObservable, observable } from 'mobx'
import React from 'react'
import { isNull } from 'Src/utils'
export class AppStore {
  public isHidden = true // modal 是否是隐藏的
  public content: React.ReactNode = null // 自组件内容
  public headerTitle = 'unknow'
  public theme = 'golden'

  constructor() {
    makeObservable(this, {
      isHidden: observable,
      isDestory: computed,
      content: observable,
      setHidden: action.bound,
      setContent: action.bound,
      switchHidden: action,
      clearContent: action.bound,

      /* header 的 title 如 set password， receive */
      headerTitle: observable,
      updateHeaderTitle: action.bound,
    })
  }

  get isDestory() {
    return isNull(this.content)
  }

  setContent(component: React.ReactElement | null) {
    this.isHidden = false
    this.content = component
  }

  clearContent() {
    this.isHidden = false
    this.content = null
  }

  setHidden() {
    this.isHidden = true
  }

  switchHidden() {
    console.log('switch')
    this.isHidden = !this.isHidden
  }

  updateHeaderTitle(name: string) {
    this.headerTitle = name
  }
}
export const store = new AppStore()
