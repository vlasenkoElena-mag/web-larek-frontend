import type { OrderItems } from '../../types';
import type { OrderCreationResultModalView, OrderCreationResultView, OrderCreationResultViewEvents } from '../../types/views/order-creation-result.view';
import { ModalBrowserView } from './common/modal.view';
import { ObservableContentModalView } from './common/observable-content-modal.view';
import { OrderCreationResultBrowserView } from './order-creation-result.view';

/**
 * Браузерная реализация `OrderCreationResultModalView`.
 * Декорирует OrderCreationResultView логикой модального окна.
 */
export class OrderCreationResultModalBrowserView
    extends ObservableContentModalView<OrderCreationResultViewEvents, OrderCreationResultView> implements OrderCreationResultModalView {
    constructor() {
        const modalRoot = document.getElementById('success-modal') as HTMLElement;

        const content = new OrderCreationResultBrowserView({
            contentOfSuccessModalRoot: modalRoot.querySelector('.order-success') as HTMLElement,
        });

        super(
            content,
            new ModalBrowserView({ rootElement: modalRoot }),
        );

        content.on('ORDER-CREATION-RESULT:CLOSED', () => this.hide());
    }

    render(totalPrice: OrderItems['total']): void {
        this._content.render(totalPrice);
        this.show();
    }
}
