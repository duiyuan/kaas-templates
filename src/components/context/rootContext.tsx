import React, { createContext } from 'react'
import { RootStore, rootStore } from '@/stores'

export default createContext<RootStore>(rootStore)
