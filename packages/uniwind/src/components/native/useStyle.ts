import { useEffect, useReducer } from 'react'
import { UniwindListener } from '../../core/listener'
import { UniwindStore } from '../../core/native'
import { useGroupContext } from '../../core/native/groupContext'
import { useHasContext } from '../../core/native/hasContext'
import { ComponentState } from '../../core/types'

export const useStyle = (
    className: string | undefined,
    componentProps: Record<string, any>,
    state?: ComponentState,
    childrenProps?: Array<Record<string, any>>,
) => {
    'use no memo'
    const [_, rerender] = useReducer(() => ({}), {})
    const groupContext = useGroupContext()
    const hasContext = useHasContext()

    const styleState = UniwindStore.getStyles(className, componentProps, state, groupContext, childrenProps)

    useEffect(() => {
        if (hasContext) {
            return hasContext.registerChild(componentProps)
        }
    }, [hasContext, componentProps])

    useEffect(() => {
        if (__DEV__ || styleState.dependencies.length > 0) {
            const dispose = UniwindListener.subscribe(rerender, styleState.dependencies)

            return dispose
        }
    }, [styleState.dependencySum])

    return styleState.styles
}
