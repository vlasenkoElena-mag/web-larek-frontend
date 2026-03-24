import type { CartModalView, CartViewEvents } from '../../../types/views/cart.view';
import type { Product } from '../../../types';
import { CartBrowserView } from './cart.view';
import { ModalBrowserView } from '../common/modal.view';
import type { EventHandler } from '../../base/event-emitter';

export class CartModalBrowserView implements CartModalView {
    private _modal: ModalBrowserView;
    private _cartView: CartBrowserView;

    constructor() {
        const modalRoot = document.getElementById('cart-modal') as HTMLElement;
        this._modal = new ModalBrowserView({ rootElement: modalRoot });
        this._cartView = new CartBrowserView();
    }

    on<E extends keyof CartViewEvents>(event: E, handler: EventHandler<CartViewEvents, E>): void {
        this._cartView.on(event, handler);
    }

    render(products: Product[], showModal = true): void {
        this._cartView.render(products);

        if (showModal) {
            this._modal.show();
        }
        else {
            this._modal.hide();
        }
    }

    setTotalPrice(totalPrice: number): void {
        this._cartView.setTotalPrice(totalPrice);
    }

    setOrderButtonDisabledState(disabled: boolean): void {
        this._cartView.setOrderButtonDisabledState(disabled);
    }
}
