import type { Observable } from '../..';

/** Событие отправки формы. */
export const FORM_SUBMIT = 'FORM-SUBMIT';

/** Событие изменения формы. */
export const FORM_CHANGED = 'FORM-CHANGED';

/**
 * Карта событий формы: при submit публикуется полезная нагрузка с данными формы.
 */
export type FormViewEvents<T extends object> = {
    [FORM_SUBMIT]: T;
    [FORM_CHANGED]: { data: T } & { isValid: boolean };
};

/**
 * Тип представления формы, представляющий `Observable` событий отправки формы.
 */
export type FormView<T extends object> = Observable<FormViewEvents<T>>;
