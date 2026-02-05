import type { Plugin } from 'vite';
type UniwindConfig = {
    cssEntryFile: string;
    extraThemes?: Array<string>;
    dtsFile?: string;
};
export declare const uniwind: ({ cssEntryFile, extraThemes, dtsFile, }: UniwindConfig) => Plugin;
export {};
