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
    private _address = '';
    private _paymentMethod: 'card' | 'cash' | '' = '';
    private _orderButton: HTMLButtonElement | null = null;
    private _onAddressInput?: (evt: Event) => void;
    private _onPaymentCardClick?: (evt: Event) => void;
    private _onPaymentCashClick?: (evt: Event) => void;
    private _onSubmit?: (evt: Event) => void;

    constructor({ form }: Params) {
        super();
        this._form = form;
    }

    render(orderDetails: OrderDetails): void {
        this._removeHandlers();

        const template = cloneTemplate<HTMLElement>('order');

        this._form.innerHTML = '';
        Array.from(template.children).forEach(child => this._form.appendChild(child.cloneNode(true)));

        const paymentMethodCardEl = this._form.querySelector('[name="card"]') as HTMLButtonElement | null;
        const paymentMethodCashEl = this._form.querySelector('[name="cash"]') as HTMLButtonElement | null;

        const addressInput = this._form.querySelector('[name="address"]') as HTMLInputElement | null;
        this._orderButton = ensureElement('.order__button', this._form) as HTMLButtonElement;

        if (addressInput && typeof orderDetails.address === 'string') {
            addressInput.value = orderDetails.address;
        }

        if (orderDetails.payment === 'card') {
            paymentMethodCardEl?.classList.add('button_alt-active');
            this._paymentMethodIsValid = true;
            this._paymentMethod = 'card';
        }
        else if (orderDetails.payment === 'cash') {
            paymentMethodCashEl?.classList.add('button_alt-active');
            this._paymentMethodIsValid = true;
            this._paymentMethod = 'cash';
        }

        this._addressIsValid = !!(addressInput?.value.trim());

        const isValid = () => {
            if (this._orderButton) {
                this._orderButton.disabled = !(this._addressIsValid && this._paymentMethodIsValid);
            }
        };

        isValid();

        this._onAddressInput = () => {
            if (!addressInput) return;
            this._addressIsValid = !!addressInput.value.trim();
            this._address = addressInput.value.trim();
            isValid();
        };

        this._onPaymentCardClick = () => {
            if (!paymentMethodCardEl) return;
            paymentMethodCardEl.classList.add('button_alt-active');
            paymentMethodCashEl?.classList.remove('button_alt-active');
            this._paymentMethodIsValid = true;
            this._paymentMethod = 'card';
            isValid();
        };

        this._onPaymentCashClick = () => {
            if (!paymentMethodCashEl) return;
            paymentMethodCashEl.classList.add('button_alt-active');
            paymentMethodCardEl?.classList.remove('button_alt-active');
            this._paymentMethodIsValid = true;
            this._paymentMethod = 'cash';
            isValid();
        };

        addressInput?.addEventListener('input', this._onAddressInput);
        paymentMethodCardEl?.addEventListener('click', this._onPaymentCardClick);
        paymentMethodCashEl?.addEventListener('click', this._onPaymentCashClick);

        this._onSubmit = (evt: Event) => {
            evt.preventDefault();
            this._emit('FORM-SUBMIT', {
                address: this._address,
                payment: this._paymentMethod,
            });
        };
        this._form.addEventListener('submit', this._onSubmit);
    }

    private _removeHandlers(): void {
        const addressInput = this._form.querySelector('[name="address"]') as HTMLInputElement | null;
        const paymentMethodCardEl = this._form.querySelector('[name="card"]') as HTMLElement | null;
        const paymentMethodCashEl = this._form.querySelector('[name="cash"]') as HTMLElement | null;

        if (addressInput && this._onAddressInput) {
            addressInput.removeEventListener('input', this._onAddressInput);
        }
        if (paymentMethodCardEl && this._onPaymentCardClick) {
            paymentMethodCardEl.removeEventListener('click', this._onPaymentCardClick);
        }
        if (paymentMethodCashEl && this._onPaymentCashClick) {
            paymentMethodCashEl.removeEventListener('click', this._onPaymentCashClick);
        }
        if (this._onSubmit) {
            this._form.removeEventListener('submit', this._onSubmit);
        }

        this._onAddressInput = undefined;
        this._onPaymentCardClick = undefined;
        this._onPaymentCashClick = undefined;
        this._onSubmit = undefined;
    }

    destroy(): void {
        this._removeHandlers();
    }

    setOrderButtonDisabledState(disabled: boolean): void {
        if (this._orderButton) {
            this._orderButton.disabled = disabled;
        }
    }
}
