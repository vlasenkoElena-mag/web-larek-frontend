import type { Contacts, Renderer } from '..';
import type { FormView, FormViewEvents } from './base/form.view';

/** Представление для редактирования контактных данных (`Contacts`). */

/**
 * Карта событий формы контактов в модальном окне.
 */
export type ContactsViewEvents = FormViewEvents<Contacts>;

/**
 * Представление модального окна с формой редактирования контактных данных (`Contacts`).
 */

export type ContactsFormView = FormView<Contacts> & {
    disableSubmitButton(): void;
    enableSubmitButton(): void;
    renderErrors(errors: string[] | Partial<Record<keyof Contacts, string>>): void;
    resetErrors(): void;
} & Renderer<Contacts>;

export type ContactsModalView = ContactsFormView;
