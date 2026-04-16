import type { CartModalView, CartView, CartViewEvents } from '../../../types/views/cart.view';
import type { Product } from '../../../types';
import { CartBrowserView } from './cart.view';
import { ModalBrowserView } from '../common/modal.view';
import { ObservableContentModalView } from '../common/observable-content-modal.view';

/** Представление модального окна корзины для браузера. */
export class CartModalBrowserView extends ObservableContentModalView<CartViewEvents, CartView> implements CartModalView {
    constructor() {
        const modalRoot = document.getElementById('cart-modal') as HTMLElement;

        super(
            new CartBrowserView(),
            new ModalBrowserView({ rootElement: modalRoot }),
        );
    }

    render(products: Product[]): void {
        this._cartView.render(products);
    }

    private get _cartView() {
        return this._content;
    }
}
