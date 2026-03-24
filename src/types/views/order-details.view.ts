import type { OrderDetails, Renderer } from '..';
import type { FormView, FormViewEvents } from './base/form.view';

/**
 * Карта событий формы деталей заказа в модальном окне.
 */
export type OrderDetailsViewEvents = FormViewEvents<OrderDetails>;

/**
 * Представление модального окна с формой редактирования деталей заказа (`OrderDetails`).
 */
export type OrderDetailsFormView = FormView<OrderDetails> & Renderer<OrderDetails>;

export type OrderDetailsModalView = OrderDetailsFormView;
