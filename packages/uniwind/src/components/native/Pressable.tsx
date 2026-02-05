import { useCallback, useMemo, useState } from 'react'
import { Pressable as RNPressable, PressableProps } from 'react-native'
import { UniwindStore } from '../../core/native'
import { GroupContext, useGroupContext } from '../../core/native/groupContext'
import { HasContext } from '../../core/native/hasContext'
import { copyComponentProperties } from '../utils'
import { useStyle } from './useStyle'

export const Pressable = copyComponentProperties(RNPressable, (props: PressableProps) => {
    const [isPressed, setIsPressed] = useState(false)
    const [childrenPropsMap, setChildrenPropsMap] = useState(new Map<any, Record<string, any>>())
    const parentGroupContext = useGroupContext()

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

    const style = useStyle(
        props.className,
        props,
        {
            isDisabled: Boolean(props.disabled),
            isPressed,
        },
        childrenProps,
    )

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
                        isPressed,
                        isFocused: false,
                        isDisabled: Boolean(props.disabled),
                        childrenProps,
                    },
                ]
            }
        })

        return nextContext
    }, [props.className, props, parentGroupContext, isPressed, childrenProps])

    let content = (
        <RNPressable
            {...props}
            onPressIn={e => {
                setIsPressed(true)
                props.onPressIn?.(e)
            }}
            onPressOut={e => {
                setIsPressed(false)
                props.onPressOut?.(e)
            }}
            style={state => {
                const currentStyle = isPressed
                    ? UniwindStore.getStyles(
                        props.className,
                        props,
                        {
                            isDisabled: Boolean(props.disabled),
                            isPressed: state.pressed || isPressed,
                        },
                        parentGroupContext,
                        childrenProps,
                    ).styles
                    : style

                return [currentStyle, typeof props.style === 'function' ? props.style(state) : props.style]
            }}
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

export default Pressable
