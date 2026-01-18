export class LoadProductsError extends Error {
    constructor(cause?: unknown) {
        super('Unable to load products.', { cause });
    }
}
