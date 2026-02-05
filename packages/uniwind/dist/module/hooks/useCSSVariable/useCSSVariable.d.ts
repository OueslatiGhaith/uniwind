type IsGenericNumber<T> = T & 0 extends -1 ? false : true;
type CreateArray<N extends number, Value, TAcc extends Array<Value> = []> = TAcc['length'] extends N ? TAcc : CreateArray<N, Value, [...TAcc, Value]>;
type UseCSSVariable = {
    (name: string): string | number | undefined;
    <const T extends Array<string>>(names: T): IsGenericNumber<T['length']> extends true ? Array<string | number | undefined> : CreateArray<T['length'], string | number | undefined>;
};
/**
 * A hook that returns the value of a CSS variable.
 * @param name Name / Array of names of the CSS variable.
 * @returns Value / Values of the CSS variable. On web it is always a string (1rem, #ff0000, etc.), but on native it can be a string or a number (16px, #ff0000)
 */
export declare const useCSSVariable: UseCSSVariable;
export {};
