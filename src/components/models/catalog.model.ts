import type { Product, ProductId } from '../../types';
import { isNil } from '../../utils/simple-utils';
import { ProductNotFoundError } from '../api/errors/product-not-found-error';

export class CatalogModel {
    private _products: Map<ProductId, Product>;

    constructor(products: Product[]) {
        this._products = new Map(products.map(product => [product.id, product]));
    }

    /**
     * Возвращает список товаров по переданному массиву идентификаторов.
     *
     * @param {ProductId[]} ids - Массив идентификаторов товаров для получения.
     * @returns {GetProductListResult} Объект с полем `products` при успехе или `error` при ошибке.
     * @throws {ProductNotFoundError} Выбрасывается если один или несколько товаров не найдены.
     */
    public getProducts(ids: ProductId[]): Product[] {
        const notExistingIds = ids.filter(id => !this._products.has(id));

        if (notExistingIds.length > 0) {
            throw new ProductNotFoundError(...notExistingIds);
        }

        const products = ids.map(id => this._products.get(id) as Product);

        return products;
    }

    /**
     * Возвращает товар по его идентификатору если он есть в каталоге, иначе пробрасывает ошибку.
     *
     * @param {ProductId} id - Идентификатор товара для выбора.
     * @throws {ProductNotFoundError} Выбрасывается если товар с таким id отсутствует.
     */
    public getProduct(id: ProductId): Product {
        const product = this._products.get(id);

        if (isNil(product)) {
            throw new ProductNotFoundError(id);
        }

        return product
    }
}
