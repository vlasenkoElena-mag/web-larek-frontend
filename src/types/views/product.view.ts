import type { Observable, Product, Renderer } from '..';
import type { ModalViewEvents } from './base/modal.view';

/** События модального окна информации о товаре. */
export type ProductViewEvents = {
    ['BUTTON-CLICK:BUY']: { productId: string };
};

/**
 * Вспомогательный тип с информацией о состоянии товара в модальном окне.
 * - `inCart` — флаг, показывающий, находится ли товар в корзине.
 */
export type ProductInfo = {
    inCart: boolean;
};

/**
 * Тип представления карточки товара.
 * Комбинация `Observable<ProductModalViewEvents>` и рендерера информации о товаре.
 */
export type ProductCardView = Observable<ProductViewEvents>
  & Renderer<Product> & { setAddToCartButtonState(disabled: boolean): void };

export type ProductModalViewEvents = ProductViewEvents & Pick<ModalViewEvents, 'MODAL:CLOSED'>;

/**
 * Тип представления модального окна товара.
 * Комбинация `Observable<ProductModalViewEvents>` и рендерера информации о товаре.
 */
export type ProductModalView = ProductCardView & Observable<ProductModalViewEvents>;
