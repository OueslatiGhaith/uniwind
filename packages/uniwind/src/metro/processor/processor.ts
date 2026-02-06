import { Declaration, MediaQuery, Rule, transform } from 'lightningcss'
import { GroupCondition } from '../../core/types'
import { Polyfills, ProcessMetaValues } from '../types'
import { Color } from './color'
import { CSS } from './css'
import { Functions } from './functions'
import { MQ } from './mq'
import { RN } from './rn'
import { Units } from './units'
import { Var } from './var'

export class ProcessorBuilder {
    stylesheets = {} as Record<string, Array<any>>
    vars = {} as Record<string, any>
    scopedVars = {} as Record<string, Record<string, any>>
    CSS = new CSS(this)
    RN = new RN(this)
    Var = new Var(this)
    MQ = new MQ(this)
    Color = new Color(this)
    Units = new Units(this)
    Functions = new Functions(this)
    meta = {} as ProcessMetaValues

    private declarationConfig = this.getDeclarationConfig()

    constructor(private readonly themes: Array<string>, readonly polyfills: Polyfills | undefined) {
        this.vars['--uniwind-em'] = polyfills?.rem ?? 16
    }

    transform(css: string) {
        transform({
            filename: 'tailwind.css',
            code: Buffer.from(css),
            visitor: {
                StyleSheet: styleSheet =>
                    styleSheet.rules.forEach(rule => {
                        this.declarationConfig = this.getDeclarationConfig()
                        this.parseRuleRec(rule)
                    }),
            },
        })
    }

    private getDeclarationConfig() {
        return ({
            className: null as string | null,
            rtl: null as boolean | null,
            mediaQueries: [] as Array<MediaQuery>,
            root: false,
            theme: null as string | null,
            active: null as boolean | null,
            focus: null as boolean | null,
            disabled: null as boolean | null,
            dataAttributes: null as Record<string, string> | null,
            group: null as GroupCondition | null,
            has: null as Record<string, any> | null,
        })
    }

    private addDeclaration(declaration: Declaration, important = false) {
        const isVar = this.declarationConfig.root || this.declarationConfig.className === null
        const mq = this.MQ.processMediaQueries(this.declarationConfig.mediaQueries)
        const style = (() => {
            if (!isVar) {
                return this.stylesheets[this.declarationConfig.className!]?.at(-1)
            }

            if (mq.platform !== null) {
                const platformKey = `__uniwind-platform-${mq.platform}`
                this.scopedVars[platformKey] ??= {}

                return this.scopedVars[platformKey]
            }

            if (this.declarationConfig.theme === null) {
                return this.vars
            }

            const themeKey = `__uniwind-theme-${this.declarationConfig.theme}`
            this.scopedVars[themeKey] ??= {}

            return this.scopedVars[themeKey]
        })()

        if (!isVar) {
            Object.assign(style, mq)
            style.importantProperties ??= []
            style.rtl = this.declarationConfig.rtl
            style.theme = mq.colorScheme ?? this.declarationConfig.theme
            style.active = this.declarationConfig.active
            style.focus = this.declarationConfig.focus
            style.disabled = this.declarationConfig.disabled
            style.dataAttributes = this.declarationConfig.dataAttributes
            style.group = this.declarationConfig.group
            style.has = this.declarationConfig.has
            this.meta.className = this.declarationConfig.className
        }

        if (declaration.property === 'unparsed') {
            style[declaration.value.propertyId.property] = this.CSS.processValue(declaration.value.value)

            if (!isVar && important) {
                style.importantProperties.push(declaration.value.propertyId.property)
            }

            return
        }

        if (declaration.property === 'custom') {
            style[declaration.value.name] = this.CSS.processValue(declaration.value.value)

            if (!isVar && important) {
                style.importantProperties.push(declaration.value.name)
            }

            return
        }

        style[declaration.property] = this.CSS.processValue(declaration.value)

        if (!isVar && important) {
            style.importantProperties.push(declaration.property)
        }
    }

    private parseRuleRec(rule: Rule<Declaration, MediaQuery>) {
        if (rule.type === 'style') {
            rule.value.selectors.forEach(selector => {
                const previousConfig = {
                    ...this.declarationConfig,
                    mediaQueries: [...this.declarationConfig.mediaQueries],
                }

                let targetClassName = null as string | null
                let rtl = null as boolean | null
                let theme = null as string | null
                let active = null as boolean | null
                let focus = null as boolean | null
                let disabled = null as boolean | null
                let dataAttributes = null as Record<string, string> | null
                let group = null as GroupCondition | null
                let has = null as Record<string, any> | null
                let isRoot = false

                // 1. Identify targetClassName (ignoring themes)
                selector.forEach(token => {
                    if (token.type === 'class' && !this.themes.includes(token.name)) {
                        targetClassName = token.name
                    }
                })

                if (targetClassName !== null) {
                    this.declarationConfig.className = targetClassName
                }

                // 2. Identify variants and global markers
                let currentPartIsGroup = false
                selector.forEach(token => {
                    if (token.type === 'class') {
                        if (token.name.startsWith('group')) {
                            if (token.name !== targetClassName) {
                                group ??= { name: JSON.stringify(token.name) }
                                currentPartIsGroup = true
                            }
                        }

                        if (this.themes.includes(token.name)) {
                            theme = token.name
                        }
                    }

                    if (token.type === 'pseudo-class') {
                        if (token.kind === 'root') {
                            isRoot = true
                        } else if (token.kind === 'active') {
                            if (currentPartIsGroup) group!.active = true
                            else active = true
                        } else if (token.kind === 'focus') {
                            if (currentPartIsGroup) group!.focus = true
                            else focus = true
                        } else if (token.kind === 'disabled') {
                            if (currentPartIsGroup) group!.disabled = true
                            else disabled = true
                        } else if (token.kind === 'dir') {
                            rtl = token.direction === 'rtl'
                        } else if (token.kind === 'where') {
                            token.selectors.forEach(s =>
                                s.forEach(t => {
                                    if (t.type === 'class' && this.themes.includes(t.name)) theme = t.name
                                    if (t.type === 'pseudo-class' && t.kind === 'dir') rtl = t.direction === 'rtl'
                                })
                            )
                        } else if (token.kind === 'has') {
                            token.selectors.forEach(s =>
                                s.forEach(t => {
                                    if (t.type === 'attribute' && t.name.startsWith('data-')) {
                                        if (currentPartIsGroup) {
                                            group!.has ??= {}
                                            group!.has[t.name] = t.operation?.operator === 'equal' ? JSON.stringify(t.operation.value) : '"true"'
                                        } else {
                                            has ??= {}
                                            has[t.name] = t.operation?.operator === 'equal' ? JSON.stringify(t.operation.value) : '"true"'
                                        }
                                    }
                                })
                            )
                        }
                    }

                    if (token.type === 'attribute' && token.name.startsWith('data-')) {
                        const val = token.operation?.operator === 'equal' ? JSON.stringify(token.operation.value) : '"true"'
                        if (currentPartIsGroup) {
                            group!.dataAttributes ??= {}
                            group!.dataAttributes[token.name] = val
                        } else {
                            dataAttributes ??= {}
                            dataAttributes[token.name] = val
                        }
                    }

                    if (token.type === 'combinator') {
                        currentPartIsGroup = false
                    }
                })

                if (rtl !== null) this.declarationConfig.rtl = rtl
                if (theme !== null) this.declarationConfig.theme = theme
                if (active !== null) this.declarationConfig.active = active
                if (focus !== null) this.declarationConfig.focus = focus
                if (disabled !== null) this.declarationConfig.disabled = disabled
                if (dataAttributes !== null) this.declarationConfig.dataAttributes = dataAttributes
                if (group !== null) this.declarationConfig.group = group
                if (has !== null) this.declarationConfig.has = has
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                if (isRoot) this.declarationConfig.root = true

                if (this.declarationConfig.className !== null) {
                    const hasNewVariants = [rtl, theme, active, focus, disabled, dataAttributes, group, has].some(v => v !== null)

                    if (targetClassName !== null || hasNewVariants) {
                        this.stylesheets[this.declarationConfig.className] ??= []
                        this.stylesheets[this.declarationConfig.className]!.push({})
                    }

                    rule.value.declarations?.declarations?.forEach(declaration => this.addDeclaration(declaration))
                    rule.value.declarations?.importantDeclarations?.forEach(declaration => this.addDeclaration(declaration, true))
                    rule.value.rules?.forEach(rule => this.parseRuleRec(rule))
                } else if (this.declarationConfig.root || theme !== null) {
                    rule.value.declarations?.declarations?.forEach(declaration => this.addDeclaration(declaration))
                    rule.value.declarations?.importantDeclarations?.forEach(declaration => this.addDeclaration(declaration, true))
                    rule.value.rules?.forEach(rule => this.parseRuleRec(rule))
                } else {
                    selector.forEach(token => {
                        if (token.type === 'pseudo-class' && token.kind === 'root') {
                            this.declarationConfig.root = true

                            rule.value.declarations?.declarations?.forEach(declaration => this.addDeclaration(declaration))
                            rule.value.declarations?.importantDeclarations?.forEach(declaration => this.addDeclaration(declaration, true))
                            rule.value.rules?.forEach(rule => this.parseRuleRec(rule))
                        }
                    })
                }

                this.declarationConfig = previousConfig
            })

            return
        }

        if (rule.type === 'supports') {
            rule.value.rules.forEach(rule => this.parseRuleRec(rule))

            return
        }

        if (rule.type === 'media') {
            const { mediaQueries } = rule.value.query
            const previousConfig = {
                ...this.declarationConfig,
                mediaQueries: [...this.declarationConfig.mediaQueries],
            }

            this.declarationConfig.mediaQueries.push(...mediaQueries)
            rule.value.rules.forEach(rule => this.parseRuleRec(rule))
            this.declarationConfig = previousConfig

            return
        }

        if (rule.type === 'layer-block') {
            rule.value.rules.forEach(rule => this.parseRuleRec(rule))

            return
        }

        if (rule.type === 'nested-declarations') {
            rule.value.declarations.declarations?.forEach(declaration => this.addDeclaration(declaration))
            rule.value.declarations.importantDeclarations?.forEach(declaration => this.addDeclaration(declaration, true))

            return
        }

        if (rule.type === 'property' && rule.value.initialValue) {
            this.vars[rule.value.name] = this.CSS.processValue(rule.value.initialValue)
        }
    }
}
