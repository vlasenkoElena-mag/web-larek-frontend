import type { Contacts } from '../../types';
import type { ContactsFormView, ContactsViewEvents } from '../../types/views/contacts.view';
import { cloneTemplate } from '../../utils/utils';
import { ObservableObject } from '../base/observable-object';

type Params = {
    form: HTMLFormElement;
};

export class ContactsFormBrowserView extends ObservableObject<ContactsViewEvents> implements ContactsFormView {
    private _form: HTMLFormElement;
    private _addressIsValid = false;
    private _paymentMethodIsValid = false;
    private _email = '';
    private _phone = '';

    constructor({ form }: Params) {
        super();
        this._form = form;
    }

    render(contacts: Contacts): void {
        const template = cloneTemplate<HTMLElement>('contacts');

        this._form.innerHTML = '';
        Array.from(template.children).forEach(child => this._form.appendChild(child.cloneNode(true)));
        const emailInput = this._form.querySelector('[name="email"]') as HTMLInputElement | null;
        const phoneInput = this._form.querySelector('[name="phone"]') as HTMLInputElement | null;
        const submitButton = this._form.querySelector('.button') as HTMLButtonElement;

        if (emailInput && typeof contacts.email === 'string') {
            emailInput.value = contacts.email;
            this._email = contacts.email;
        }
        if (phoneInput && typeof contacts.phone === 'string') {
            phoneInput.value = contacts.phone;
            this._phone = contacts.phone;
        }

        const isValid = () => {
            if (this._addressIsValid && this._paymentMethodIsValid) {
                submitButton.disabled = false;
            }
            else {
                submitButton.disabled = true;
            }
        };

        emailInput?.addEventListener('input', () => {
            this._addressIsValid = !!emailInput.value.trim();
            this._email = emailInput.value.trim();
            isValid();
        });

        phoneInput?.addEventListener('input', () => {
            this._paymentMethodIsValid = !!phoneInput.value.trim();
            this._phone = phoneInput.value.trim();
            isValid();
        });

        this._form.addEventListener('submit', evt => {
            evt.preventDefault();
            this._emit('FORM-SUBMIT', {
                email: this._email,
                phone: this._phone,
            });
        });
    }
}
