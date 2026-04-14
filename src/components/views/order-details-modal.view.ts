import type { OrderDetailsModalView, OrderDetailsViewEvents as Events } from '../../types/views/order-details.view';
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

    on<E extends keyof Events>(event: E, handler: (payload: Events[E]) => void): void {
        this._form.on(event, handler);
    }

    show(): void {
        this._modal.show();
    }

    setOrderButtonDisabledState(disabled: boolean): void {
        this._form.setOrderButtonDisabledState(disabled);
    }
}
