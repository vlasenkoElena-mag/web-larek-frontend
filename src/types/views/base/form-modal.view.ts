import type { FormView } from './form.view';
import type { ModalView } from './modal.view';

/**
 * Комбинированный тип для форм, отображаемых в модальном окне.
 */
export type FormModalView<T extends object> = FormView<T> & ModalView;
