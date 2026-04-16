import type { Contacts } from '../../types';
import type { ContactsFormView, ContactsViewEvents } from '../../types/views/contacts.view';
import { ensureElement } from '../../utils/utils';
import { ObservableObject } from '../base/observable-object';

/** Параметры для создания представления формы контактов. */

type Params = {
    form: HTMLFormElement;
};

/** Представление формы контактов. */
export class ContactsFormBrowserView extends ObservableObject<ContactsViewEvents> implements ContactsFormView {
    private _form: HTMLFormElement;
    private _emailInput: HTMLInputElement;
    private _phoneInput: HTMLInputElement;
    private _submitButton: HTMLButtonElement;
    private _formErrors: HTMLElement;
    private _onSubmit?: (evt: Event) => void;
    private wasChanged = false;

    constructor({ form }: Params) {
        super();
        this._form = form;
        this._emailInput = ensureElement<HTMLInputElement>('[name="email"]', this._form);
        this._phoneInput = ensureElement<HTMLInputElement>('[name="phone"]', this._form);
        this._submitButton = ensureElement<HTMLButtonElement>('.button', this._form);
        this._formErrors = ensureElement<HTMLElement>('.form__errors', this._form);
        this._formErrors.style.whiteSpace = 'pre-wrap';
        this._addHandlers();
    }

    public render({ email, phone }: Contacts): void {
        this._emailInput.value = email;
        this._phoneInput.value = phone;
    }

    public renderErrors = (errors: string[]) => {
        if (!this.wasChanged) {
            return;
        }

        this._formErrors.textContent = errors.join('\n');
    };

    public resetErrors = () => {
        this._formErrors.textContent = '';
    };

    public enableSubmitButton(): void {
        this._submitButton.disabled = false;
    }

    public disableSubmitButton(): void {
        this._submitButton.disabled = true;
    }

    private _addHandlers() {
        const _onEmailInput = () => {
            this._emitChangeEvent();
        };

        this._emailInput?.addEventListener('input', _onEmailInput);

        const _onPhoneInput = () => {
            this._emitChangeEvent();
        };

        this._phoneInput?.addEventListener('input', _onPhoneInput);

        this._onSubmit = (evt: Event) => {
            evt.preventDefault();
            this._emit('FORM-SUBMIT', {
                email: this._email,
                phone: this._phone,
            });
        };

        this._form.addEventListener('submit', this._onSubmit);
    }

    private get _email(): string {
        return this._emailInput.value.trim();
    }

    private get _phone(): string {
        return this._phoneInput.value.trim();
    }

    private _emitChangeEvent() {
        this.wasChanged = true;
        this._emit('FORM-CHANGED', {
            data: { email: this._email, phone: this._phone },
        });
    }
}
