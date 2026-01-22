import { CustomerInfo, OrderParams } from '../../../types';

export class InvalidCustomerInfoError extends Error {
    constructor(params: CustomerInfo) {
        super(`Invalid customer info. Params: ${JSON.stringify(params)}`);
    }
}