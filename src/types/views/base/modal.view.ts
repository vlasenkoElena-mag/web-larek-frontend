import type { Observable } from '../..';
import type { MODAL_EVENTS } from './constants';

export type ModalEventName = typeof MODAL_EVENTS[number];

export type ModalViewEvents = Record<ModalEventName, undefined>;

/**
 * Базовое представление модального окна.
 * Обеспечивает методы показа и скрытия модального окна.
 */
export type ModalView = {
    show(): void;
    hide(): void;
} & Observable<ModalViewEvents>;
