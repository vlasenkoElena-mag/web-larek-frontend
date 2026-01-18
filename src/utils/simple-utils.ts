export const noop = () => {};

type Nil = undefined | null;

export const isNil = (value: unknown): value is Nil => value === undefined || value === null;

export const assert = (predicate: boolean, errorMessage: string) => {
    if (!predicate) {
        throw new Error(`Assertion error: ${errorMessage}`, { });
    }
};

export const asArray = <T>(value: T | T[]): T[] => Array.isArray(value) ? value : [value];

export const formatPrice = (price: number): string => `$${price} синапсов`;
