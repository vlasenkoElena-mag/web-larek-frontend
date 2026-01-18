import type { ProductId } from '../../../types';

export class ProductNotFoundError extends Error {
    constructor(...productId: ProductId[]) {
        super(`Product not found. Id: ${productId.join(', ')}`);
    }
}
