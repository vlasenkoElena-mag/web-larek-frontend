import type { OrderItems } from '../../types';
import type { OrderCreationResultModalView } from '../../types/views/order-creation-result.view';
import { ModalBrowserView } from './common/modal.view';
import { OrderCreationResultBrowserView } from './order-creation-result.view';

export class OrderCreationResultModalBrowserView implements OrderCreationResultModalView {
    private _modal: ModalBrowserView;
    private _contentOfSuccessModalRoot: OrderCreationResultBrowserView;

    constructor() {
        const modalRoot = document.getElementById('success-modal') as HTMLElement;
        const contentOfSuccessModalRoot = modalRoot.querySelector('.order-success') as HTMLElement;
        this._modal = new ModalBrowserView({ rootElement: modalRoot });
        this._contentOfSuccessModalRoot = new OrderCreationResultBrowserView({ contentOfSuccessModalRoot });
        this._contentOfSuccessModalRoot.on('ORDER-CREATION-RESULT:CLOSED', () => {
            this._modal.hide();
        });
    }

    on(...params: Parameters<OrderCreationResultBrowserView['on']>): void {
        this._contentOfSuccessModalRoot.on(...params);
    }

    render(totalPrice: OrderItems['total']): void {
        this._contentOfSuccessModalRoot.render(totalPrice);
        this._modal.show();
    }
}
