import type { ContactsModalView, ContactsViewEvents } from '../../types/views/contacts.view';
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

    on<E extends keyof ContactsViewEvents>(event: E, handler: (payload: ContactsViewEvents[E]) => void): void {
        this._form.on(event, handler);
    }

    show(): void {
        this._modal.show();
    }
}
