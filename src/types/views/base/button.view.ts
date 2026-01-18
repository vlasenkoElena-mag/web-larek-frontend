import type { Observable } from '../..';

/** Событие клика по кнопке. */
export const BUTTON_CLICK = 'BUTTON-CLICK';

/**
 * Карта событий для `ButtonView`.
 * Публикуется при клике по кнопке.
 */
export type ButtonViewEvents = {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    [BUTTON_CLICK]: {};
};

/**
 * Тип представления кнопки.
 * Набор событий в виде `Observable<ButtonViewEvents>`.
 */
export type ButtonView = Observable<ButtonViewEvents>;
