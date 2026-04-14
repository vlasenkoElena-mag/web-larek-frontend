import type { Contacts } from '..';
import type { FormView, FormViewEvents } from './base/form.view';
import type { ModalView } from './base/modal.view';

/** Представление для редактирования контактных данных (`Contacts`). */

/**
 * Карта событий формы контактов в модальном окне.
 */
export type ContactsViewEvents = FormViewEvents<Contacts>;

/**
 * Представление модального окна с формой редактирования контактных данных (`Contacts`).
 */

export type ContactsFormView = FormView<Contacts>;

export type ContactsModalView = ContactsFormView & Pick<ModalView, 'show'>;
