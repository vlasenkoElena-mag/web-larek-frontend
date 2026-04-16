import type { Product, ProductId } from '../../types';
import type { ProductApi } from '../../types/api/product.api';
import type { ProductsModel, ProductsModelEvents } from '../../types/model/model';
import { ObservableObject } from '../base/observable-object';

export class CatalogModel extends ObservableObject<ProductsModelEvents> implements ProductsModel {
    private _products: Map<ProductId, Product>;
    private _api: ProductApi;
    private selectedProduct: Product | null = null;

    constructor(api: ProductApi) {
        super();
        this._api = api;
        this._products = new Map();
    }

    /**
    * Загружает товары из API.
     */
    public async loadProducts(): Promise<void> {
        const { products, error } = await this._api.getAll();

        if (error === null && products !== null) {
            (products.items || []).forEach(product => this._products.set(product.id, product));
            this._emit('PRODUCTS:LOADED', { products: Array.from(this._products.values()) });
        }
        else {
            console.error(error);
        }
    }

    /**
     * Возвращает товар по его идентификатору если он есть в каталоге.
     */
    public getProduct(id: string): Product {
        const product = this._products.get(id);

        if (!product) {
            throw new Error('Application logic error: trying to get product by id that is not in catalog');
        }

        return product;
    }

    /**
     *
     * @param productId
     * Устанавливает выбранный товар.
     */
    public selectProduct(productId: string): void {
        const product = this.getProduct(productId);
        this.selectedProduct = product;
        this._emit('PRODUCT:SELECTED', { product: this.selectedProduct });
    }

    /**
     * Сбрасывает выбранный товар.
     */

    public resetSelectedProduct(): void {
        this.selectedProduct = null;
    }
}
