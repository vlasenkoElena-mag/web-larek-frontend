import type { ProductId, Product, Order, OrderDetails, Contacts } from '../../types';
import type { CreateOrderResult, OrderApi } from '../../types/api/order.api';
import { isNil } from '../../utils/simple-utils';
import type { CreateOrderError } from '../api/errors/order-creation-error';
import { EventEmitter } from '../base/event-emitter';

/** Карта событий `OrderModel`. */
export type EventMap = {
    /** Публикуется при изменении содержимого корзины. */
    ['CART:UPDATED']: { products: Product[] };
    /** Публикуется после успешного создания заказа. */
    ['ORDER:CREATED']: { order: Order };
    /** Публикуется при ошибке создания заказа. */
    ['ERROR:ORDER:CREATE']: CreateOrderError;
};

/**
 * Зависимости `OrderModel`.
 */
export type Deps = {
    /** API для создания заказа */
    orderApi: OrderApi;
};

/**
 * Модель корзины и создания заказа.
 * Управляет списком товаров в корзине, данными заказа и контактами пользователя.
 * Публикует события, описанные в `EventMap`.
 */
export class OrderModel extends EventEmitter<EventMap> {
    private _products: Product[] = [];
    private _orderApi: OrderApi;
    private _orderDetails: OrderDetails = { address: '', payment: '' };
    private _contacts: Contacts = { email: '', phone: '' };

    /**
     * Создаёт экземпляр `OrderModel`.
     *
     * @param {Deps} deps - Зависимости модели.
     */
    constructor({ orderApi }: Deps) {
        super();
        this._orderApi = orderApi;
    }

    /** Возвращает копию деталей заказа. */
    get orderDetails(): OrderDetails {
        return structuredClone(this._orderDetails);
    }

    /** Возвращает копию контактных данных покупателя. */
    get contacts(): Contacts {
        return structuredClone(this._contacts);
    }

    /**
     * Добавляет товар в корзину и публикует событие `'CART:UPDATED'`.
     * Если товар уже присутствует в корзине — операция игнорируется.
     *
     * @param product - Товар для добавления.
     */
    public addProduct(product: Product): void {
        const isAlreadyInCart = !isNil(this._products.find(p => p.id === product.id));

        if (isAlreadyInCart) {
            return;
        }

        this._products.push(product);
        this.emit('CART:UPDATED', this._getCartUpdateEventPayload());
    }

    /** Устанавливает детали заказа (адрес, способ оплаты). */
    public setOrderDetails(details: OrderDetails) {
        this._orderDetails = details;
    }

    /** Устанавливает контактные данные покупателя. */
    public setContacts(contacts: Contacts) {
        this._contacts = contacts;
    }

    /**
     * Создаёт заказ через `orderApi` на основе текущей корзины, деталей и контактов.
     * Публикует `'ORDER:CREATED'` при успехе или `'ERROR:ORDER:CREATE'` при ошибке.
     */
    public createOrder(): void {
        this._orderApi.create({
            items: this._products.map(p => p.id),
            total: this._products.reduce((sum, p) => sum + p.price, 0),
            ...this._orderDetails,
            ...this._contacts,
        }).then(result => this._handelOrderCreationResult(result));
    };

    /** Удаляет товар из корзины и публикует `'CART:UPDATED'`. */
    public removeProduct(productId: ProductId): void {
        this._products = this._products.filter(p => p.id !== productId);
        this.emit('CART:UPDATED', this._getCartUpdateEventPayload());
    }

    /** Очищает корзину и публикует `'CART:UPDATED'`. */
    public clearCart(): void {
        this._products = [];
        this.emit('CART:UPDATED', this._getCartUpdateEventPayload());
    }

    /** Обрабатывает результат создания заказа и публикует соответствующее событие. */
    private _handelOrderCreationResult({ error, order }: CreateOrderResult) {
        if (error === null) {
            return this.emit('ORDER:CREATED', { order });
        }
        else {
            return this.emit('ERROR:ORDER:CREATE', error);
        }
    }

    /** Возвращает полезную нагрузку события обновления корзины (клонированный список товаров). */
    private _getCartUpdateEventPayload() {
        return {
            products: structuredClone(this._products) };
    }
}
