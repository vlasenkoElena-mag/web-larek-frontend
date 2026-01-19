import { OrderParams } from '../../../types';

export class InvalidOrderParamsError extends Error {
    constructor(orderParams: OrderParams) {
        super(`Invalid order parameters. Params: ${JSON.stringify(orderParams)}`);
    }
}