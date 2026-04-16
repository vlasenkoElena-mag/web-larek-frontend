import type { OrderItems } from '../../types';
import type { OrderCreationResultView, OrderCreationResultViewEvents } from '../../types/views/order-creation-result.view';
import { cloneTemplate } from '../../utils/utils';
import { ObservableObject } from '../base/observable-object';

type Params = {
    contentOfSuccessModalRoot: HTMLElement;
};

/** Представление результата создания заказа. */
export class OrderCreationResultBrowserView extends ObservableObject<OrderCreationResultViewEvents> implements OrderCreationResultView {
    private _contentOfSuccessModalRoot: HTMLElement;

    constructor({ contentOfSuccessModalRoot }: Params) {
        super();
        this._contentOfSuccessModalRoot = contentOfSuccessModalRoot;
    }

    render(totalPrice: OrderItems['total']): void {
        const template = cloneTemplate<HTMLElement>('success');
        this._contentOfSuccessModalRoot.textContent = '';
        Array.from(template.children).forEach(child => this._contentOfSuccessModalRoot.appendChild(child.cloneNode(true)));
        const totalPriceEl = this._contentOfSuccessModalRoot.querySelector('.order-success__description') as HTMLElement;
        totalPriceEl.textContent = `Списано ${totalPrice} синапсов`;

        const button = this._contentOfSuccessModalRoot.querySelector('.order-success__close') as HTMLButtonElement;

        button.addEventListener('click', () => {
            this._emit('ORDER-CREATION-RESULT:CLOSED', undefined);
        });
    }
}
