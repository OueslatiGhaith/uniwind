import { StyleDependency } from '../../types';
import { ComponentState, CSSVariables, GenerateStyleSheetsCallback, RNStyle } from '../types';
import { GroupContextType } from './groupContext';
type StylesResult = {
    styles: RNStyle;
    dependencies: Array<StyleDependency>;
    dependencySum: number;
    hasDataAttributes: boolean;
    hasGroup: boolean;
    hasHas: boolean;
};
declare class UniwindStoreBuilder {
    runtime: import("../types").UniwindRuntime;
    vars: Record<string, unknown>;
    runtimeThemeVariables: Map<string, CSSVariables>;
    private stylesheet;
    private cache;
    private generateStyleSheetCallbackResult;
    getStyles(className: string | undefined, componentProps?: Record<string, any>, state?: ComponentState, groupContext?: GroupContextType, childrenProps?: Array<Record<string, any>>): StylesResult;
    reinit: (generateStyleSheetCallback?: GenerateStyleSheetsCallback) => void;
    private resolveStyles;
    private validateGroup;
    private validateHas;
    private validateDataAttributes;
}
export declare const UniwindStore: UniwindStoreBuilder;
export {};
