import type { CartModalView, CartViewEvents } from '../../types/views/cart.view';
import type { Product } from '../../types';
import { CartBrowserView } from './cart.view';
import { ModalBrowserView } from './common/modal.view';
import { ObservableObject } from '../base/observable-object';

export class CartModalBrowserView extends ObservableObject<CartViewEvents> implements CartModalView {
    private _modal: ModalBrowserView;
    private _cartView: CartBrowserView;

    constructor() {
        super();
        const modalRoot = document.getElementById('cart-modal') as HTMLElement;
        this._modal = new ModalBrowserView({ rootElement: modalRoot });
        this._cartView = new CartBrowserView();
    }

    render(products: Product[]): void {
        this._cartView.render(products);
        this._modal.show();
    }
}
