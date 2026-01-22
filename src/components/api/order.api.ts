import { OrderCreationResponse, OrderParams, Product } from '../../types';
import { CreateOrderResult, OrderApi as IOrderApi } from '../../types/api/order.api';
import { Api } from '../base/api';
import { LoadProductsError } from './errors/product-list-loading-error';

export class OrderApi extends Api implements IOrderApi {
    async create(order: OrderParams): Promise<CreateOrderResult> {
        try {
            const result = await this.post('/order', order) as OrderCreationResponse;
            return { error: null, order: result };
        } catch (error) { 
            return { error: new LoadProductsError(error), order: null };
        }
    }
}