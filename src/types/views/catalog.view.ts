import type { ProductId, Observable, Product, Renderer } from '../index.ts';

/** События представления каталога. */
export type CatalogViewEvents = {
    /** публикуется при выборе пользователем товара из каталога */
    ['PRODUCT:SELECTED']: { productId: ProductId };
};

/** Тип представления каталога товаров. */
export type CatalogView = Observable<CatalogViewEvents> & Renderer<Product[]>;
