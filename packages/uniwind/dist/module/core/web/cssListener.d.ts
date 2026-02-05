declare class CSSListenerBuilder {
    private classNameMediaQueryListeners;
    private listeners;
    private registeredRules;
    private processedStyleSheets;
    private pendingInitialization;
    constructor();
    subscribeToClassName(classNames: string, listener: VoidFunction): () => void;
    private scheduleInitialization;
    private cancelPendingInitialization;
    private initialize;
    private isStyleRule;
    private isMediaRule;
    private collectParentMediaQueries;
    private addMediaQueriesDeep;
    private addMediaQuery;
}
export declare const CSSListener: CSSListenerBuilder;
export {};
