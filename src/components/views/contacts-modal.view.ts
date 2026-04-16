import type { ContactsFormView, ContactsModalView, ContactsViewEvents } from '../../types/views/contacts.view';
import { ensureElement } from '../../utils/utils';
import { ObservableContentModalView } from './common/observable-content-modal.view';
import { ModalBrowserView } from './common/modal.view';
import { ContactsFormBrowserView } from './contacts-form.view';
import type { Contacts } from '../../types';

/**
 * Браузерная реализация `ContactsModalView`.
 * Декорирует ContactsFormView логикой модального окна.
 */
export class ContactsModalBrowserView extends ObservableContentModalView<ContactsViewEvents, ContactsFormView> implements ContactsModalView {
    constructor() {
        const modalRoot = document.getElementById('contacts-modal') as HTMLElement;

        super(
            new ContactsFormBrowserView({ form: ensureElement<HTMLFormElement>('form', modalRoot) }),
            new ModalBrowserView({ rootElement: modalRoot }),
        );
    }

    render({ email, phone }: Contacts): void {
        this._form.render({ email, phone });
        this._modal.show();
    }

    enableSubmitButton(): void {
        this._form.enableSubmitButton();
    }

    disableSubmitButton(): void {
        this._form.disableSubmitButton();
    }

    renderErrors(errors: string[]): void {
        this._form.renderErrors(errors);
    }

    resetErrors(): void {
        this._form.resetErrors();
    }

    private get _form() {
        return this._content;
    }
}
