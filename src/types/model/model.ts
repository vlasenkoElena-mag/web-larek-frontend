import type { Observable, Product, OrderItems, CustomerInfo } from '../index.ts';

/** События модели продуктов. */
export type ProductsModelEvents = {
    /** публикуется при загрузке всех продуктов каталога */
    ['PRODUCTS:LOADED']: { products: Product[] };
    ['PRODUCT:SELECTED']: { product: Product };
};

/** События модели покупателя. */
export type CustomerModelEvents = {
    /** Публикуется при обновлении данных покупателя */
    ['CUSTOMER:CHANGED']: { customerInfo: CustomerInfo };
};

/** Тип модели продуктов. */
export type ProductsModel = Observable<ProductsModelEvents>;

/** Тип корзины продуктов. */
export type CartModelEvents = {
    /** публикуется при обновлении содержимого корзины */
    ['CART:UPDATED']: { products: Product[] };
};

export type CartModel = Observable<CartModelEvents> & {
    /** Проверяет, есть ли товар в корзине по id. */
    has(productId: string): boolean;

    /** Добавляет товар в корзину. */
    addProduct(product: Product): void;

    /** Удаляет товар из корзины по id. */
    removeProduct(productId: string): void;

    /** Текущие товары в корзине (опционально). */
    products?: Product[];

    /** Возвращает валидные позиции для создания заказа. */
    getValidItems(): OrderItems;

    /** Общая сумма корзины */
    totalPrice: number;

    /** Очищает корзину. */
    clear(): void;
};
