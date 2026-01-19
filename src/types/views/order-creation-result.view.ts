import type { Renderer } from '..';

/** Тип представления результата создания заказа. */
export type OrderCreationResultView = Renderer<{ totalPrice: number }> ;
