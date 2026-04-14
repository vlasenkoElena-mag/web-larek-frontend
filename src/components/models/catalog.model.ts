import type { Product, ProductId } from '../../types';
import type { ProductApi } from '../../types/api/product.api';
import type { ProductsModel, ProductsModelEvents } from '../../types/model/model';
import { isNil } from '../../utils/simple-utils';
import { ProductNotFoundError } from '../api/errors/product-not-found-error';
import { ObservableObject } from '../base/observable-object';

export class CatalogModel extends ObservableObject<ProductsModelEvents> implements ProductsModel {
    private _products: Map<ProductId, Product>;
    private _preview: Product | null = null;
    api: ProductApi;

    constructor(api: ProductApi) {
        super();
        this.api = api;
        this._products = new Map();
    }

    /**
     * Возвращает список товаров по переданному массиву идентификаторов.
     *
     * @param {ProductId[]} ids - Массив идентификаторов товаров для получения.
     * @returns {GetProductListResult} Объект с полем `products` при успехе или `error` при ошибке.
     * @throws {ProductNotFoundError} Выбрасывается если один или несколько товаров не найдены.
     */
    public async loadProducts(): Promise<void> {
        const { products, error } = await this.api.getAll();

        if (error === null && products !== null) {
            (products.items || []).forEach(product => this._products.set(product.id, product));
            this._emit('PRODUCTS:LOADED', { products: Array.from(this._products.values()) });
        }
        else {
            console.error(error);
        }
    }
    /**
     * Возвращает товар по его идентификатору если он есть в каталоге, иначе пробрасывает ошибку.
     *
     * @param {ProductId} id - Идентификатор товара для выбора.
     * @throws {ProductNotFoundError} Выбрасывается если товар с таким id отсутствует.
     */

    public async loadProductById(id: string): Promise<Product> {
        const { product, error } = await this.api.getProductById(id);

        if (isNil(product)) {
            throw new ProductNotFoundError(id);
        }

        if (error !== null) {
            console.error(error);
        }

        return product;
    }

    public setPreview(preview: Product): void {
        this._preview = preview;
        this._emit('PREVIEW:UPDATED', { preview });
    }
}
