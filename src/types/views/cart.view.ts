import type { ProductId, Observable, Product } from '../../types/index';

/** События представления корзины. */
export type CartViewEvents = {
    /** публикуется при удалении товара из корзины */
    ['BUTTON-CLICK:REMOVE-PRODUCT']: { productId: ProductId };
    /** публикуется при нажатии кнопки оформления заказа */
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    ['BUTTON-CLICK:ORDER-CREATE']: undefined;
};

/** Тип представления корзины. */
export type CartView = Observable<CartViewEvents> & {
    /** Отрисовать список товаров; если `showModal` истинно — показать модал */
    render(products: Product[], showModal?: boolean): void;

    /** Устанавливает общую сумму корзины для отображения */
    setTotalPrice(totalPrice: number): void;

    /** Устанавливает состояние кнопки оформления заказа (активна/неактивна) */
    setOrderButtonDisabledState(disabled: boolean): void;
};

export type CartModalView = CartView;
