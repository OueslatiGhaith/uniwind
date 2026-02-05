import { Insets } from 'react-native';
import { CSSVariables, GenerateStyleSheetsCallback, ThemeName } from '../types';
declare const SYSTEM_THEME: "system";
export declare class UniwindConfigBuilder {
    #private;
    protected themes: string[];
    constructor();
    get hasAdaptiveThemes(): boolean;
    get currentTheme(): ThemeName;
    private get colorScheme();
    setTheme(theme: ThemeName | typeof SYSTEM_THEME): void;
    updateCSSVariables(theme: ThemeName, variables: CSSVariables): void;
    updateInsets(insets: Insets): void;
    protected __reinit(_: GenerateStyleSheetsCallback, themes: Array<string>): void;
    protected onThemeChange(): void;
}
export declare const Uniwind: UniwindConfigBuilder;
export {};
