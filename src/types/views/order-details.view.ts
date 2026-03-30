import type { OrderDetails, Renderer } from '..';
import type { FormView, FormViewEvents } from './base/form.view';

/**
 * Карта событий формы деталей заказа в модальном окне.
 */
export type OrderDetailsViewEvents = FormViewEvents<OrderDetails>;

/**
 * Представление модального окна с формой редактирования деталей заказа (`OrderDetails`).
 */
export type OrderDetailsFormView = FormView<OrderDetails> & Renderer<OrderDetails> & {

    /** Устанавливает состояние кнопки оформления заказа (активна/неактивна) */
    setOrderButtonDisabledState(disabled: boolean): void;
};

export type OrderDetailsModalView = OrderDetailsFormView;
