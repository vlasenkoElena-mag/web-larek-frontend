import type { Observable } from '../..';

/** Событие отправки формы. */
export const FORM_SUBMIT = 'FORM-SUBMIT';

/**
 * Карта событий формы: при submit публикуется полезная нагрузка с данными формы.
 */
export type FromViewEvents<T extends object> = {
    [FORM_SUBMIT]: T;
};

/**
 * Тип представления формы, представляющий `Observable` событий отправки формы.
 */
export type FormView<T extends object> = Observable<FromViewEvents<T>>;
