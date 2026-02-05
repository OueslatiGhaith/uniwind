import { act, fireEvent } from '@testing-library/react-native'
import * as React from 'react'
import Pressable from '../../src/components/native/Pressable'
import View from '../../src/components/native/View'
import { TW_BLUE_500, TW_GREEN_500, TW_RED_500 } from '../consts'
import { renderUniwind } from '../utils'

describe('Group and Has variants', () => {
    test('should apply group-active variant via Pressable', () => {
        const { getStylesFromId, getByTestId } = renderUniwind(
            <Pressable className="group" testID="group">
                <View className="group-active-bg-red-500" testID="child" />
            </Pressable>,
        )

        // Initial state
        expect(getStylesFromId('child').backgroundColor).toBeUndefined()

        // Press group
        fireEvent(getByTestId('group'), 'pressIn')
        expect(getStylesFromId('child').backgroundColor).toBe(TW_RED_500)

        // Press out
        act(() => {
            fireEvent(getByTestId('group'), 'onPressOut')
        })
        expect(getStylesFromId('child').backgroundColor).toBeUndefined()
    })

    test('should apply group-data variant', () => {
        const { getStylesFromId, rerender } = renderUniwind(
            <View className="group" data-active="true">
                <View className="group-data-active-true-bg-red-500" testID="child" />
            </View>,
        )

        expect(getStylesFromId('child').backgroundColor).toBe(TW_RED_500)

        rerender(
            <View className="group" data-active="false">
                <View className="group-data-active-true-bg-red-500" testID="child" />
            </View>,
        )
        expect(getStylesFromId('child').backgroundColor).toBeUndefined()
    })

    test('should apply named group variant', () => {
        const { getStylesFromId } = renderUniwind(
            <View className="group/card" data-active="true">
                <View className="group-data-active-true-card-bg-red-500" testID="child" />
            </View>,
        )

        expect(getStylesFromId('child').backgroundColor).toBe(TW_RED_500)
    })

    test('should apply has variant', () => {
        const { getStylesFromId, rerender } = renderUniwind(
            <View className="has-data-active-true-bg-blue-500" testID="parent">
                <View data-active="true" />
            </View>,
        )

        expect(getStylesFromId('parent').backgroundColor).toBe(TW_BLUE_500)

        rerender(
            <View className="has-data-active-true-bg-blue-500" testID="parent">
                <View data-active="false" />
            </View>,
        )
        expect(getStylesFromId('parent').backgroundColor).toBeUndefined()
    })

    test('should apply group-has variant', () => {
        const { getStylesFromId, rerender } = renderUniwind(
            <View className="group">
                <View data-active="true" />
                <View className="group-has-data-active-true-bg-green-500" testID="target" />
            </View>,
        )

        expect(getStylesFromId('target').backgroundColor).toBe(TW_GREEN_500)

        rerender(
            <View className="group">
                <View data-active="false" />
                <View className="group-has-data-active-true-bg-green-500" testID="target" />
            </View>,
        )
        expect(getStylesFromId('target').backgroundColor).toBeUndefined()
    })

    test('should not bleed state between sibling groups', () => {
        const { getStylesFromId } = renderUniwind(
            <View>
                <View className="group" data-active="true">
                    <View className="group-data-active-true-bg-red-500" testID="child1" />
                </View>
                <View className="group" data-active="false">
                    <View className="group-data-active-true-bg-red-500" testID="child2" />
                </View>
            </View>,
        )

        expect(getStylesFromId('child1').backgroundColor).toBe(TW_RED_500)
        expect(getStylesFromId('child2').backgroundColor).toBeUndefined()
    })

    test('should isolate named groups from each other', () => {
        const { getStylesFromId } = renderUniwind(
            <View className="group/card" data-active="true">
                <View className="group/other" data-active="false">
                    <View className="group-data-active-true-card-bg-red-500" testID="card-target" />
                    <View className="group-data-active-true-other-bg-yellow-500" testID="other-target" />
                </View>
            </View>,
        )

        expect(getStylesFromId('card-target').backgroundColor).toBe(TW_RED_500)
        expect(getStylesFromId('other-target').backgroundColor).toBeUndefined()
    })

    test('should match any ancestor group with the same name', () => {
        const { getStylesFromId } = renderUniwind(
            <View className="group" data-id="outer">
                <View className="group" data-id="inner">
                    <View className="group-data-id-outer-bg-red-500" testID="target" />
                </View>
            </View>,
        )

        // We need a rule for .group[data-id="outer"] .group-data-id-outer-bg-red-500
        // I'll add it to test.css first
        expect(getStylesFromId('target').backgroundColor).toBe(TW_RED_500)
    })
})
