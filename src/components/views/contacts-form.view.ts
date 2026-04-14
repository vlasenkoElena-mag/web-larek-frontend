import type { ContactsFormView, ContactsViewEvents } from '../../types/views/contacts.view';
import { ensureElement } from '../../utils/utils';
import { ObservableObject } from '../base/observable-object';

type Params = {
    form: HTMLFormElement;
};

export class ContactsFormBrowserView extends ObservableObject<ContactsViewEvents> implements ContactsFormView {
    private _form: HTMLFormElement;
    private _emailInput: HTMLInputElement;
    private _phoneInput: HTMLInputElement;
    private _submitButton: HTMLButtonElement;
    private _formErrors: HTMLElement;
    private _onSubmit?: (evt: Event) => void;

    constructor({ form }: Params) {
        super();
        this._form = form;
        this._emailInput = ensureElement<HTMLInputElement>('[name="email"]', this._form);
        this._phoneInput = ensureElement<HTMLInputElement>('[name="phone"]', this._form);
        this._submitButton = ensureElement<HTMLButtonElement>('.button', this._form);
        this._formErrors = ensureElement<HTMLElement>('.form__errors', this._form);
        this._formErrors.style.whiteSpace = 'pre-wrap';
        this.addHandlers();
    }

    addHandlers() {
        const _onEmailInput = () => {
            this._handleErrors();
            this._emitChangeEvent();
        };

        this._emailInput?.addEventListener('input', _onEmailInput);

        const _onPhoneInput = () => {
            this._handleErrors();
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
        this._emit('FORM-CHANGED', {
            data: { email: this._email, phone: this._phone },
            isValid: this._isValid(),
        });
    }

    private _isValid(): boolean {
        return this._emailInput.checkValidity() && this._phoneInput.checkValidity();
    }

    private _validate(): string[] {
        const errors: string[] = [];

        if (!this._emailInput.checkValidity()) {
            if (this._emailInput.validity.typeMismatch) {
                errors.push('Введите корректный Email');
            }
        }

        if (!this._phoneInput.checkValidity()) {
            if (this._phoneInput.validity.patternMismatch) {
                errors.push('Телефон должен быть в формате +7XXXXXXXXXX или 8XXXXXXXXXX');
            }
        }

        if (errors.length === 0) {
            this._formErrors.textContent = '';
        }

        return errors;
    }

    private _handleErrors = () => {
        const errors = this._validate();
        this._submitButton.disabled = errors.length > 0;

        if (errors.length > 0) {
            this._renderErrors(errors);
        }
    };

    private _renderErrors = (errors: string[]) => {
        if (errors.length === 0) {
            return;
        }

        this._formErrors.textContent = errors.join('\n');
    };
}
