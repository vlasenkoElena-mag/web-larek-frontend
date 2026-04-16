import type { Observable, OrderItems, Renderer } from '..';

export type OrderCreationResultViewEvents = {
    /** публикуется при клике на кнопку "Закрыть" в окне результата создания заказа */
    ['ORDER-CREATION-RESULT:CLOSED']: undefined;
};

/** Тип представления результата создания заказа. */
export type OrderCreationResultView = Renderer<OrderItems['total']> & Observable<OrderCreationResultViewEvents>;

export type OrderCreationResultModalView = Renderer<OrderItems['total']>;
