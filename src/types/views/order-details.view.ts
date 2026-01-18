import type { OrderDetails } from '..';
import type { FromModalView } from './base/form-modal.view';
import type { FORM_SUBMIT } from './base/form.view';

/**
 * Карта событий формы деталей заказа в модальном окне.
 */
export type OrderDetailsViewEvents = {
    /** публикуется при принятии формы параметров заказа */
    [FORM_SUBMIT]: OrderDetails;
};

/**
 * Представление модального окна с формой редактирования деталей заказа (`OrderDetails`).
 */
export type OrderDetailsView = Omit<FromModalView<OrderDetails>, 'show' | 'modalRoot' | 'form'> & {
    show(orderDetails: OrderDetails): void;
};

