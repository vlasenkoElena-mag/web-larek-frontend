import type { Product, ProductId } from '../../types';
import type { ProductApi } from '../../types/api/product.api';
import { isNil } from '../../utils/simple-utils';
import type { LoadProductsError } from '../api/errors/product-list-loading-error';
import { ProductNotFoundError } from '../api/errors/product-not-found-error';
import { EventEmitter } from '../base/event-emitter';

/** Зависимости модели каталога товаров. */
type Deps = {
    /** api для получения данных о товарах */
    productApi: ProductApi;
};

/**
 * Карта событий `CatalogModel`.
 */
export type EventMap = {
    /** Публикуется после успешной загрузки списка товаров. */
    ['PRODUCTS:LOADED']: { products: Product[] };
    /** Публикуется при выборе товара пользователем. */
    ['PRODUCT:SELECTED']: { product: Product };
    /** Публикуется при ошибке загрузки списка товаров. */
    ['ERROR:PRODUCTS:LOAD']: LoadProductsError;
};

/**
 * Модель каталога товаров.
 * Управляет загрузкой списка товаров, их хранением и выбором конкретного товара.
 * Публикует события, описанные в `EventMap`.
 */
export class CatalogModel extends EventEmitter<EventMap> {
    private _productApi: ProductApi;
    private _products: Map<ProductId, Product>;

    /**
     * Создаёт экземпляр `CatalogModel`.
     * @param {Deps} deps - Зависимости модели.
     */
    constructor({ productApi }: Deps) {
        super();
        this._productApi = productApi;
        this._products = new Map();
    }

    /**
     * Инициализирует модель, запрашивая все товары через `productApi`.
     * - При ошибке публикует событие `'ERROR:PRODUCTS:LOAD'`.
     * - При успешной загрузке сохраняет товары в локальную карту и публикует `'PRODUCTS:LOADED'`.
     *
     * @returns {Promise<void>} Асинхронная операция загрузки.
     */
    public async init(): Promise<void> {
        const { error, products } = await this._productApi.getAll();

        if (error) {
            this.emit('ERROR:PRODUCTS:LOAD', error);
            return;
        }
        else {
            this._products = new Map(products.map(product => [product.id, product]));
            this.emit('PRODUCTS:LOADED', { products });
        }
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
     * Публикует событие `'PRODUCT:SELECTED'`.
     *
     * @param {ProductId} id - Идентификатор товара для выбора.
     * @throws {ProductNotFoundError} Выбрасывается если товар с таким id отсутствует.
     */
    public selectProduct(id: ProductId): void {
        const product = this._products.get(id);

        if (isNil(product)) {
            throw new ProductNotFoundError(id);
        }

        this.emit('PRODUCT:SELECTED', { product });
    }
}
