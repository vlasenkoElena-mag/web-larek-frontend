import type { OrderDetails } from '../../types';
import type { OrderDetailsModalView } from '../../types/views/order-details.view';
import { ModalBrowserView } from './common/modal.view';
import { OrderDetailsFormBrowserView } from './order-details-form.view';

export class OrderDetailsModalBrowserView implements OrderDetailsModalView {
    private _modal: ModalBrowserView;
    private _form: OrderDetailsFormBrowserView;

    constructor() {
        const modalRoot = document.getElementById('order-modal') as HTMLElement;
        const form = modalRoot.querySelector('form') as HTMLFormElement;
        this._modal = new ModalBrowserView({ rootElement: modalRoot });
        this._form = new OrderDetailsFormBrowserView({ form });
    }

    on(...params: Parameters<OrderDetailsFormBrowserView['on']>): void {
        this._form.on(...params);
    }

    render(orderDetails: OrderDetails): void {
        this._form.render(orderDetails);
        this._modal.show();
    }
}
