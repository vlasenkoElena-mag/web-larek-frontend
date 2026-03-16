import type { ProductCardView, ProductModalView } from '../../../types/views/product.view';
import { ensureElement } from '../../../utils/utils';
import { ModalBrowserView } from '../common/modal.view';
import { ProductCardBrowserView } from './product-card.view';

/**
 * Браузерная реализация `ProductModalView`.
 * Декорирует ProductCardView логикой модального окна.
 */
export class ProductModalBrowserView implements ProductModalView {
    private _modal: ModalBrowserView;
    private _productCardView: ProductCardBrowserView;

    constructor() {
        const modalRoot = document.getElementById('product-modal') as HTMLElement;
        this._modal = new ModalBrowserView({ rootElement: modalRoot });
        this._productCardView = new ProductCardBrowserView({ productCardElement: ensureElement('.card_full', modalRoot) });
    }

    /** Делегирует подписки на события внутреннего `ProductView`. */
    on(...params: Parameters<ProductCardView['on']>): void {
        this._productCardView.on(...params);
    };

    /** Рендерит данные в карточку товара и показывает модальное окно. */
    render(params: Parameters<ProductCardView['render']>[0]): void {
        this._productCardView.render(params);
        this._modal.show();
    }

    /** Устанавливает состояние кнопки покупки товара. */
    setButtonDisabledState(disabled: boolean): void {
        this._productCardView.setButtonDisabledState(disabled);
    }
}
