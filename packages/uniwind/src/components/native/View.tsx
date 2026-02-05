import { useCallback, useMemo, useState } from 'react'
import { View as RNView, ViewProps } from 'react-native'
import { GroupContext, useGroupContext } from '../../core/native/groupContext'
import { HasContext } from '../../core/native/hasContext'
import { copyComponentProperties } from '../utils'
import { useStyle } from './useStyle'

export const View = copyComponentProperties(RNView, (props: ViewProps) => {
    const [childrenPropsMap, setChildrenPropsMap] = useState(new Map<any, Record<string, any>>())
    const registerChild = useCallback((childProps: Record<string, any>) => {
        const id = {}
        setChildrenPropsMap(prev => new Map(prev).set(id, childProps))
        return () =>
            setChildrenPropsMap(prev => {
                const next = new Map(prev)
                next.delete(id)
                return next
            })
    }, [])

    const hasContextValue = useMemo(() => ({ registerChild }), [registerChild])
    const childrenProps = useMemo(() => Array.from(childrenPropsMap.values()), [childrenPropsMap])

    const style = useStyle(props.className, props, undefined, childrenProps)
    const parentGroupContext = useGroupContext()

    const groupContext = useMemo(() => {
        const className = props.className
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (!className || (!className.includes('group') && !className.includes('group/'))) {
            return parentGroupContext
        }

        const nextContext = { ...parentGroupContext }
        const dataAttributes = Object.fromEntries(
            Object.entries(props).filter(([key]) => key.startsWith('data-')),
        )

        className.split(' ').forEach(cls => {
            if (cls === 'group' || cls.startsWith('group/')) {
                nextContext[cls] = [
                    ...(parentGroupContext[cls] ?? []),
                    {
                        dataAttributes,
                        childrenProps,
                    },
                ]
            }
        })

        return nextContext
    }, [props.className, props, parentGroupContext, childrenProps])

    let content = (
        <RNView
            {...props}
            style={[style, props.style]}
        />
    )

    const isGroup = props.className?.split(' ').some(cls => cls === 'group' || cls.startsWith('group/'))
    const useHas = props.className?.includes('has-')

    if (isGroup || useHas) {
        content = (
            <HasContext.Provider value={hasContextValue}>
                {content}
            </HasContext.Provider>
        )
    }

    if (groupContext !== parentGroupContext) {
        content = (
            <GroupContext.Provider value={groupContext}>
                {content}
            </GroupContext.Provider>
        )
    }

    return content
})

export default View
