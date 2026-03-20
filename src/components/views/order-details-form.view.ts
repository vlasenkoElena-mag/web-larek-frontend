import type { OrderDetails } from '../../types';
import type { OrderDetailsFormView, OrderDetailsViewEvents } from '../../types/views/order-details.view';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { ObservableObject } from '../base/observable-object';

type Params = {
    form: HTMLFormElement;
};

export class OrderDetailsFormBrowserView extends ObservableObject<OrderDetailsViewEvents> implements OrderDetailsFormView {
    private _form: HTMLFormElement;
    private _addressIsValid = false;
    private _paymentMethodIsValid = false;

    constructor({ form }: Params) {
        super();
        this._form = form;
    }

    render(orderDetails: OrderDetails): void {
        const template = cloneTemplate<HTMLElement>('order');

        this._form.innerHTML = '';
        Array.from(template.children).forEach(child => this._form.appendChild(child.cloneNode(true)));

        const paymentMethodCardEl = this._form.querySelector('[name="card"]') as HTMLButtonElement | null;
        const paymentMethodCashEl = this._form.querySelector('[name="cash"]') as HTMLButtonElement | null;
        const addressInput = this._form.querySelector('[name="address"]') as HTMLInputElement | null;
        const orderButton = ensureElement('.order__button', this._form) as HTMLButtonElement;

        const isValid = () => {
            if (this._addressIsValid && this._paymentMethodIsValid) {
                orderButton.disabled = false;
            }
            else {
                orderButton.disabled = true;
            }
        };

        addressInput?.addEventListener('input', () => {
            this._addressIsValid = !!addressInput.value.trim();
            isValid();
        });

        if (addressInput && typeof orderDetails.address === 'string') {
            addressInput.value = orderDetails.address;
        }

        if (orderDetails.payment === 'card') {
            paymentMethodCardEl?.classList.add('button_alt-active');
            this._paymentMethodIsValid = true;
        }
        else if (orderDetails.payment === 'cash') {
            paymentMethodCashEl?.classList.add('button_alt-active');
            this._paymentMethodIsValid = true;
        }

        paymentMethodCardEl?.addEventListener('click', () => {
            paymentMethodCardEl.classList.add('button_alt-active');
            paymentMethodCashEl?.classList.remove('button_alt-active');
            this._paymentMethodIsValid = true;
            isValid();
        });
        paymentMethodCashEl?.addEventListener('click', () => {
            paymentMethodCashEl.classList.add('button_alt-active');
            paymentMethodCardEl?.classList.remove('button_alt-active');
            this._paymentMethodIsValid = true;
            isValid();
        });
    }
}
