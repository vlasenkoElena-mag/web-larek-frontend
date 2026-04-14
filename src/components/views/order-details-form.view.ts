import type { OrderDetailsFormView, OrderDetailsViewEvents } from '../../types/views/order-details.view';
import { ensureElement } from '../../utils/utils';
import { ObservableObject } from '../base/observable-object';

type Params = {
    form: HTMLFormElement;
};

export class OrderDetailsFormBrowserView extends ObservableObject<OrderDetailsViewEvents> implements OrderDetailsFormView {
    private _form: HTMLFormElement;
    private _address = '';
    private _paymentMethod: 'card' | 'cash' | '' = '';
    private _orderButton: HTMLButtonElement;
    private _addressInput: HTMLInputElement;
    private _paymentMethodCardEl: HTMLButtonElement;
    private _paymentMethodCashEl: HTMLButtonElement;
    private _onSubmit?: (evt: Event) => void;

    constructor({ form }: Params) {
        super();
        this._form = form;
        this._addressInput = ensureElement<HTMLInputElement>('[name="address"]', this._form);
        this._paymentMethodCardEl = ensureElement<HTMLButtonElement>('[name="card"]', this._form);
        this._paymentMethodCashEl = ensureElement<HTMLButtonElement>('[name="cash"]', this._form);
        this._orderButton = ensureElement('.order__button', this._form) as HTMLButtonElement;
        this.addHandlers();
    }

    addHandlers() {
        const onAddressInput = () => {
            this.setOrderButtonDisabledState(this._validate());
            this._emit('FORM-CHANGED', {
                data: { address: this._address, payment: this._paymentMethod },
                isValid: this._validate(),
            });
        };
        this._addressInput.addEventListener('input', onAddressInput);

        const onPaymentCardClick = () => {
            this._paymentMethodCardEl.classList.add('button_alt-active');
            this._paymentMethodCashEl.classList.remove('button_alt-active');
            this._paymentMethod = 'card';
            this._emit('FORM-CHANGED', {
                data: { address: this._address, payment: this._paymentMethod },
                isValid: this._validate(),
            });
        };
        this._paymentMethodCardEl.addEventListener('click', onPaymentCardClick);

        const onPaymentCashClick = () => {
            this._paymentMethodCashEl.classList.add('button_alt-active');
            this._paymentMethodCardEl.classList.remove('button_alt-active');
            this._paymentMethod = 'cash';
            this._emit('FORM-CHANGED', {
                data: { address: this._address, payment: this._paymentMethod },
                isValid: this._validate(),
            });
        };
        this._paymentMethodCashEl.addEventListener('click', onPaymentCashClick);

        this._onSubmit = (evt: Event) => {
            evt.preventDefault();
            this._emit('FORM-SUBMIT', {
                address: this._address,
                payment: this._paymentMethod,
            });
        };
        this._form.addEventListener('submit', this._onSubmit);
    }

    private _validate(): boolean {
        return this._addressInput.value.trim() !== '' && this._paymentMethod !== '';
    }

    setOrderButtonDisabledState(disabled: boolean): void {
        this._orderButton.disabled = disabled;
    }
}
