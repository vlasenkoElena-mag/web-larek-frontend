import type { Contacts } from '../../types';
import type { ContactsFormView, ContactsViewEvents } from '../../types/views/contacts.view';
import { cloneTemplate } from '../../utils/utils';
import { ObservableObject } from '../base/observable-object';

type Params = {
    form: HTMLFormElement;
};

export class ContactsFormBrowserView extends ObservableObject<ContactsViewEvents> implements ContactsFormView {
    private _form: HTMLFormElement;
    private _emailIsValid = false;
    private _phoneIsValid = false;
    private _email = '';
    private _phone = '';
    private _onEmailInput?: (evt: Event) => void;
    private _onPhoneInput?: (evt: Event) => void;
    private _onSubmit?: (evt: Event) => void;

    constructor({ form }: Params) {
        super();
        this._form = form;
    }

    render(contacts: Contacts): void {
        this._removeHandlers();

        const template = cloneTemplate<HTMLElement>('contacts');

        this._form.innerHTML = '';
        Array.from(template.children).forEach(child => this._form.appendChild(child.cloneNode(true)));
        const emailInput = this._form.querySelector('[name="email"]') as HTMLInputElement | null;
        const phoneInput = this._form.querySelector('[name="phone"]') as HTMLInputElement | null;
        const submitButton = this._form.querySelector('.button') as HTMLButtonElement | null;

        if (emailInput && typeof contacts.email === 'string') {
            emailInput.value = contacts.email;
            this._email = contacts.email;
        }

        if (phoneInput && typeof contacts.phone === 'string') {
            phoneInput.value = contacts.phone;
            this._phone = contacts.phone;
        }

        this._onEmailInput = () => {
            if (!emailInput) return;
            this._email = emailInput.value.trim();
            this._emailIsValid = !!emailInput.value.trim() && emailInput.checkValidity();
            renderErrors();
            if (submitButton) {
                submitButton.disabled = !(this._emailIsValid && this._phoneIsValid);
            }
        };

        this._onPhoneInput = () => {
            if (!phoneInput) return;
            this._phone = phoneInput.value.trim();
            this._phoneIsValid = !!phoneInput.value.trim() && phoneInput.checkValidity();
            renderErrors();
            if (submitButton) {
                submitButton.disabled = !(this._emailIsValid && this._phoneIsValid);
            }
        };

        emailInput?.addEventListener('input', this._onEmailInput);
        phoneInput?.addEventListener('input', this._onPhoneInput);

        this._emailIsValid = !!(emailInput && emailInput.value.trim() && emailInput.checkValidity());
        this._phoneIsValid = !!(phoneInput && phoneInput.value.trim() && phoneInput.checkValidity());
        if (submitButton) submitButton.disabled = !(this._emailIsValid && this._phoneIsValid);

        const formErrors = this._form.querySelector('.form__errors') as HTMLElement | null;

        const renderErrors = () => {
            if (!formErrors) return;
            const errors: string[] = [];

            if (emailInput) {
                if (emailInput.value.trim() && !emailInput.checkValidity()) {
                    if (emailInput.validity.typeMismatch) {
                        errors.push('Введите корректный Email');
                    }
                }
            }

            if (phoneInput) {
                if (phoneInput.value.trim() && !phoneInput.checkValidity()) {
                    if (phoneInput.validity.patternMismatch) {
                        errors.push('Телефон должен быть в формате +7XXXXXXXXXX или 8XXXXXXXXXX');
                    }
                }
            }

            formErrors.style.whiteSpace = 'pre-wrap';
            formErrors.textContent = errors.join('\n');
        };

        renderErrors();

        this._onSubmit = (evt: Event) => {
            evt.preventDefault();
            this._emit('FORM-SUBMIT', {
                email: this._email,
                phone: this._phone,
            });
        };
        this._form.addEventListener('submit', this._onSubmit);
    }

    private _removeHandlers(): void {
        const emailInput = this._form.querySelector('[name="email"]') as HTMLInputElement | null;
        const phoneInput = this._form.querySelector('[name="phone"]') as HTMLInputElement | null;
        if (emailInput && this._onEmailInput) {
            emailInput.removeEventListener('input', this._onEmailInput);
        }
        if (phoneInput && this._onPhoneInput) {
            phoneInput.removeEventListener('input', this._onPhoneInput);
        }
        if (this._onSubmit) {
            this._form.removeEventListener('submit', this._onSubmit);
        }
        this._onEmailInput = undefined;
        this._onPhoneInput = undefined;
        this._onSubmit = undefined;
    }

    destroy(): void {
        this._removeHandlers();
    }
}
