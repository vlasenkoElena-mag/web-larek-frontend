import type { Product } from '../../types/index.ts';
import type { ProductApi as IProductApi, LoadProductResult } from '../../types/api/product.api.ts';
import { Api } from '../base/api';
import { LoadProductsError } from './errors/product-list-loading-error';

export class ProductApi extends Api implements IProductApi {
    async getAll(): Promise<LoadProductResult> {
        try {
            const products = await this.get('/products') as Product[];
            return { error: null, products };
        }
        catch (error) {
            return { error: new LoadProductsError(error), products: null };
        }
    }
}
