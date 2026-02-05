export type HasContextType = {
    registerChild: (props: Record<string, any>) => () => void;
};
export declare const HasContext: import("react").Context<HasContextType | null>;
export declare const useHasContext: () => HasContextType | null;
