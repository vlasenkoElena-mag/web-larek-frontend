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
        this._cartView.on('BUTTON-CLICK:REMOVE-PRODUCT', payload => this._emit('BUTTON-CLICK:REMOVE-PRODUCT', payload));
    }

    render(products: Product[], showModal = true): void {
        this._cartView.render(products);
        if (showModal) {
            this._modal.show();
        }
    }

    setTotalPrice(totalPrice: number): void {
        this._cartView.setTotalPrice(totalPrice);
    }

    setOrderButtonDisabledState(disabled: boolean): void {
        this._cartView.setOrderButtonDisabledState(disabled);
    }
}
