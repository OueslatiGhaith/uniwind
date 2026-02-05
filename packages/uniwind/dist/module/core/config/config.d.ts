import { CSSVariables, ThemeName } from '../types';
import { UniwindConfigBuilder as UniwindConfigBuilderBase } from './config.common';
declare class UniwindConfigBuilder extends UniwindConfigBuilderBase {
    private runtimeCSSVariables;
    constructor();
    updateCSSVariables(theme: ThemeName, variables: CSSVariables): void;
    protected onThemeChange(): void;
    private applyCSSVariable;
}
export declare const Uniwind: UniwindConfigBuilder;
export {};
