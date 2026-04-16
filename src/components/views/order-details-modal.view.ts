import type { OrderDetails } from '../../types';
import type { OrderDetailsModalView, OrderDetailsFormView, OrderDetailsViewEvents } from '../../types/views/order-details.view';
import { ModalBrowserView } from './common/modal.view';
import { ObservableContentModalView } from './common/observable-content-modal.view';
import { OrderDetailsFormBrowserView } from './order-details-form.view';

/**
 * Браузерная реализация `OrderDetailsModalView`.
 * Декорирует OrderDetailsFormView логикой модального окна.
 */
export class OrderDetailsModalBrowserView
    extends ObservableContentModalView<OrderDetailsViewEvents, OrderDetailsFormView> implements OrderDetailsModalView {
    constructor() {
        const modalRoot = document.getElementById('order-modal') as HTMLElement;
        const form = modalRoot.querySelector('form') as HTMLFormElement;

        super(
            new OrderDetailsFormBrowserView({ form }),
            new ModalBrowserView({ rootElement: modalRoot }),
        );
    }

    render(data: OrderDetails): void {
        this._form.render(data);
        this._modal.show();
    }

    enableSubmitButton(): void {
        this._form.enableSubmitButton();
    }

    disableSubmitButton(): void {
        this._form.disableSubmitButton();
    }

    private get _form() {
        return this._content;
    }
}
