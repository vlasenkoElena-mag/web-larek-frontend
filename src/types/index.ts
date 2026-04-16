/** Уникальный идентификатор товара. */
export type ProductId = string;

/** Тип способа оплаты (строка, например "card" или "cash"). */
export type Payment = 'cash' | 'card' | '';

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
    /** Цена товара в целых единицах. */
    price: number | null;
};

export type OrderCreationResponse = {
    id: string;
    total: number;
};

/** Детали заказа. */
export type OrderDetails = {
    /** Способ оплаты. */
    payment: Payment;
    /** Адрес доставки. */
    address: string;
};

export type OrderDetailsErrors = {
    payment?: string;
    address?: string;
};

/** Контактные данные покупателя. */
export type Contacts = {
    /** Email пользователя. */
    email: string;
    /** Телефон пользователя. */
    phone: string;
};

/** Контактные данные покупателя. */
export type ContactsErrors = {
    /** Email пользователя. */
    email?: string;
    /** Телефон пользователя. */
    phone?: string;
};

export type OrderItems = {
    /** Общая сумма заказа. */
    total: number;
    /** Список идентификаторов товаров в заказе. */
    items: ProductId[];
};

/**
 * Параметры заказа, используемые при создании заказа.
 * Объединяет детали заказа, контакты и служебные поля `total` и `items`.
 */
export type OrderParams = OrderDetails & Contacts & OrderItems;

export type CustomerInfo = Contacts & OrderDetails;

/**
 * Базовый интерфейс наблюдаемых ресурсов (например различные экземпляры)
 * для типизации публикуемых событий.
 */
export type Observable<Events extends object> = {
    on<E extends keyof Events>(event: E, handler: (payload: Events[E]) => void): void;
};

/** Базовый интерфейс представлений отображающих данные. */
export type Renderer<T> = {
    render(data: T): void;
};
