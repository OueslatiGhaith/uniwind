import { createContext, useContext } from 'react'

export type HasContextType = {
    registerChild: (props: Record<string, any>) => () => void
}

export const HasContext = createContext<HasContextType | null>(null)
export const useHasContext = () => useContext(HasContext)
