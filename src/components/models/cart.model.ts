import type { ProductId, Product, OrderItems } from '../../types';
import { isNil } from '../../utils/simple-utils';
import { EmptyCartOrderCreationError } from '../api/errors/empty-cart-order-creation-error';

/**
 * Модель корзины, содержит продукты добавленные пользователем и логику формирования `OrderItems`.
 */
export class CartModel {
    private _products: Product[] = [];

    get products(): Product[] {
        return structuredClone(this._products);
    }

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

    }

    /** Удаляет товар из корзины */
    public removeProduct(productId: ProductId): void {
        this._products = this._products.filter(p => p.id !== productId);
    }

    /** Возвращает данные корзины в формате требуемом для создания заказа. */
    public getValidItems(): OrderItems {
        if (this._products.length === 0) {
            throw new EmptyCartOrderCreationError();
        }
        
        return {
            items: this._products.map(p => p.id),
            total: this._products.reduce((sum, p) => sum + (p.price ?? 0), 0),
        };
    }

    /** Очищает корзину. */
    public clear(): void {
        this._products = [];
    }
}
