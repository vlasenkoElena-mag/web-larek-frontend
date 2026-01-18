import type { Contacts } from '..';
import type { FromModalView } from './base/form-modal.view';

/** Представление для редактирования контактных данных (`Contacts`). */
export type ContactsView = Omit<FromModalView<Contacts>, 'show' | 'modalRoot' | 'form'> & {
    show(contacts: Contacts): void;
};
