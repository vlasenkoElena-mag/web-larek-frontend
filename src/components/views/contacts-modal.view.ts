import type { Contacts } from '../../types';
import type { ContactsModalView } from '../../types/views/contacts.view';
import { ModalBrowserView } from './common/modal.view';
import { ContactsFormBrowserView } from './contacts-form.view';

export class ContactsModalBrowserView implements ContactsModalView {
    private _modal: ModalBrowserView;
    private _form: ContactsFormBrowserView;

    constructor() {
        const modalRoot = document.getElementById('contacts-modal') as HTMLElement;
        const form = modalRoot.querySelector('form') as HTMLFormElement;
        this._modal = new ModalBrowserView({ rootElement: modalRoot });
        this._form = new ContactsFormBrowserView({ form });
    }

    on(...params: Parameters<ContactsFormBrowserView['on']>): void {
        this._form.on(...params);
    }

    render(contacts: Contacts): void {
        this._form.render(contacts);
        this._modal.show();
    }
}
