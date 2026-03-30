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

    show(): void {
        this._modal.show();
    }

    hide(): void {
        this._modal.hide();
    }

    render(products: Product[]): void {
        this._cartView.render(products);
    }
}
