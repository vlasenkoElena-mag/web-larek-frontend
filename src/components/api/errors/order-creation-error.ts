import type { OrderParams } from '../../../types';

export class CreateOrderError extends Error {
    constructor(params: OrderParams, cause?: unknown) {
        super(`Order creation error. params: ${JSON.stringify(params)}`, { cause });
    }
}
