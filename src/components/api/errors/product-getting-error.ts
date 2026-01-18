import type { ProductId } from '../../../types';

export class GetProductError extends Error {
    constructor(productId: ProductId, cause?: unknown) {
        super(`Product getting error. Product id: ${productId}`, { cause });
    }
}
