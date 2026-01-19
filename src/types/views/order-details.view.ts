import type { OrderDetails } from '..';
import type { FormModalView } from './base/form-modal.view';
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
export type OrderDetailsView = Omit<FormModalView<OrderDetails>, 'show' | 'modalRoot' | 'form'> & {
    render(orderDetails: OrderDetails): void;
};

