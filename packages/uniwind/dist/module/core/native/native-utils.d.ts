import type { UniwindRuntime } from '../types';
export declare const colorMix: (color: string, weight: number | string, mixColor: string) => string;
export declare function lightDark(this: UniwindRuntime, light: string, dark: string): string;
export declare const cloneWithAccessors: <T extends object>(obj: T) => any;
export declare const parseColor: (type: string, color: string) => string;
