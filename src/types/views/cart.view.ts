import type { ProductId, Observable, Product, Renderer } from '../../types/index';

/** События представления корзины. */
export type CartViewEvents = {
    /** публикуется при удалении товара из корзины */
    ['BUTTON-CLICK:REMOVE-PRODUCT']: { productId: ProductId };
    /** публикуется при нажатии кнопки оформления заказа */
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    ['BUTTON-CLICK:ORDER-CREATE']: undefined;
};

/** Тип представления корзины. */
export type CartView = Observable<CartViewEvents> & Renderer<Product[]>;

export type CartModalView = CartView;
