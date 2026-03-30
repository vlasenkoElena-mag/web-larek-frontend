import type { Observable, Product, Renderer } from '..';

/** События модального окна информации о товаре. */
export type ProductModalViewEvents = {
    ['BUTTON-CLICK:BUY']: { product: Product };
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
export type ProductCardView = Observable<ProductModalViewEvents>
  & Renderer<Product> & { setButtonDisabledState(disabled: boolean): void };

/**
 * Тип представления модального окна товара.
 * Комбинация `Observable<ProductModalViewEvents>` и рендерера информации о товаре.
 */
export type ProductModalView = ProductCardView;
