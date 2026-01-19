import type { Contacts } from '..';
import type { FormModalView } from './base/form-modal.view';

/** Представление для редактирования контактных данных (`Contacts`). */
export type ContactsView = Omit<FormModalView<Contacts>, 'show'> & {
    render(contacts: Contacts): void;
};
