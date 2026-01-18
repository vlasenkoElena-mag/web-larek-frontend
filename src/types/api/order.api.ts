import type { Order, OrderParams } from '..';
import type { CreateOrderError } from '../../components/api/errors/order-creation-error';

export type CreateOrderResult = { order: Order; error: null }
  | { order: null; error: CreateOrderError };

export type OrderApi = {
    /** отправляет запрос на создание заказа */
    create(order: OrderParams): Promise<CreateOrderResult>;
};
