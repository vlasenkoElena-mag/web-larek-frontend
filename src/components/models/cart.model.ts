import type { ProductId, Product, OrderItems } from '../../types';
import type { CartModelEvents, CartModel as ICartModel } from '../../types/model/model';
import { isNil } from '../../utils/simple-utils';
import { EmptyCartOrderCreationError } from '../api/errors/empty-cart-order-creation-error';
import { ObservableObject } from '../base/observable-object';

/**
 * Модель корзины, содержит продукты добавленные пользователем и логику формирования `OrderItems`.
 */
export class CartModel extends ObservableObject<CartModelEvents> implements ICartModel {
    private _products: Product[] = [];

    get products(): Product[] {
        return structuredClone(this._products);
    }

    get totalPrice(): number {
        return this.products.reduce((sum, product) => sum + (product.price ?? 0), 0);
    }
    /** Проверяет, присутствует ли товар в корзине */

    public has(productId: ProductId): boolean {
        return !isNil(this._products.find(p => p.id === productId));
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
        this._emit('CART:UPDATED', { products: this.products });
    }

    /** Удаляет товар из корзины */
    public removeProduct(productId: ProductId): void {
        this._products = this._products.filter(p => p.id !== productId);
        this._emit('CART:UPDATED', { products: this.products });
    }

    /** Возвращает данные корзины в формате требуемом для создания заказа. */
    public getValidItems(): OrderItems {
        if (this._products.length === 0) {
            throw new EmptyCartOrderCreationError();
        }

        return {
            items: this._products.map(p => p.id),
            total: this.totalPrice,
        };
    }

    /** Очищает корзину. */
    public clear(): void {
        this._products = [];
        this._emit('CART:UPDATED', { products: [] });
    }
}
