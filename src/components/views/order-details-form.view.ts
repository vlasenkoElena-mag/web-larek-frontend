import type { OrderDetails } from '../../types';
import type { OrderDetailsFormView, OrderDetailsViewEvents } from '../../types/views/order-details.view';
import { ensureElement } from '../../utils/utils';
import { ObservableObject } from '../base/observable-object';

type Params = {
    form: HTMLFormElement;
};

/** Представление формы деталей заказа. */
export class OrderDetailsFormBrowserView extends ObservableObject<OrderDetailsViewEvents> implements OrderDetailsFormView {
    private _form: HTMLFormElement;
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

    public render({ address, payment }: OrderDetails): void {
        this._addressInput.value = address;
        if (payment === 'card') {
            this._paymentMethodCardEl.classList.add('button_alt-active');
            this._paymentMethodCashEl.classList.remove('button_alt-active');
        }
        else if (payment === 'cash') {
            this._paymentMethodCashEl.classList.add('button_alt-active');
            this._paymentMethodCardEl.classList.remove('button_alt-active');
        }
        else {
            this._paymentMethodCardEl.classList.remove('button_alt-active');
            this._paymentMethodCashEl.classList.remove('button_alt-active');
        }
    }

    enableSubmitButton(): void {
        this._orderButton.disabled = false;
    }

    disableSubmitButton(): void {
        this._orderButton.disabled = true;
    }

    addHandlers() {
        const getPayment = (): 'card' | 'cash' | '' => {
            if (this._paymentMethodCardEl.classList.contains('button_alt-active')) return 'card';
            if (this._paymentMethodCashEl.classList.contains('button_alt-active')) return 'cash';
            return '';
        };

        const onAddressInput = () => {
            const address = this._addressInput.value.trim();
            this._emit('FORM-CHANGED', {
                data: { address, payment: getPayment() },
            });
        };
        this._addressInput.addEventListener('input', onAddressInput);

        const onPaymentCardClick = () => {
            this._paymentMethodCardEl.classList.add('button_alt-active');
            this._paymentMethodCashEl.classList.remove('button_alt-active');
            this._emit('FORM-CHANGED', {
                data: { address: this._addressInput.value.trim(), payment: 'card' },
            });
        };
        this._paymentMethodCardEl.addEventListener('click', onPaymentCardClick);

        const onPaymentCashClick = () => {
            this._paymentMethodCashEl.classList.add('button_alt-active');
            this._paymentMethodCardEl.classList.remove('button_alt-active');
            this._emit('FORM-CHANGED', {
                data: { address: this._addressInput.value.trim(), payment: 'cash' },
            });
        };
        this._paymentMethodCashEl.addEventListener('click', onPaymentCashClick);

        this._onSubmit = (evt: Event) => {
            evt.preventDefault();
            const address = this._addressInput.value.trim();
            const payment = getPayment();
            this._emit('FORM-SUBMIT', {
                address,
                payment,
            });
        };
        this._form.addEventListener('submit', this._onSubmit);
    }
}
