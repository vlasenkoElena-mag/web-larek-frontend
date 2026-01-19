/** Уникальный идентификатор товара. */
export type ProductId = string;

/** Числовое представление цены товара. */
export type Price = number;

/** Тип способа оплаты (строка, например "card" или "cash"). */
export type Payment = string;

/**
 * Описание товара в каталоге.
 */
export type Product = {
    /** Уникальный идентификатор товара. */
    id: ProductId;
    /** Краткое описание товара. */
    description: string;
    /** Путь или URL к изображению товара. */
    image: string;
    /** Название товара. */
    title: string;
    /** Категория товара. */
    category: string;
    /** Цена товара в целых единицах (тип `Price`). */
    price: number | null;
};

/** Детали заказа. */
export type OrderDetails = {
    /** Способ оплаты. */
    payment: Payment;
    /** Адрес доставки. */
    address: string;
};

/** Контактные данные покупателя. */
export type Contacts = {
    /** Email пользователя. */
    email: string;
    /** Телефон пользователя. */
    phone: string;
};

/**
 * Параметры заказа, используемые при создании заказа.
 * Объединяет детали заказа, контакты и служебные поля `total` и `items`.
 */
export type OrderParams = OrderDetails & Contacts & {
    /** Общая сумма заказа. */
    total: number;
    /** Список идентификаторов товаров в заказе. */
    items: ProductId[];
};

/** Представление созданного заказа (включая `orderId`). */
export type Order = OrderParams & { orderId: OrderId };

/** Уникальный идентификатор заказа. */
export type OrderId = string;

/**
 * Базовый интерфейс наблюдаемых ресурсов (например различные экземпляры View и Model)
 * для типизации публикуемых событий.
 */
export type Observable<Events extends Record<string, unknown>> = {
    on<E extends keyof Events>(event: E, handler: (payload: Events[E]) => void): void;
};

/** Базовый интерфейс представлений отображающих данные. */
export type Renderer<T> = {
    render(data: T): void;
};
