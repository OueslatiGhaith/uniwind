import { createContext, useContext } from 'react'
import { ComponentState } from '../types'

export type GroupState = ComponentState & {
    dataAttributes?: Record<string, any>
    childrenProps?: Array<Record<string, any>>
}

export type GroupContextType = Record<string, Array<GroupState>>

export const GroupContext = createContext<GroupContextType>({})

export const useGroupContext = () => useContext(GroupContext)
