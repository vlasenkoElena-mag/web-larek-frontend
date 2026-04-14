import type { Observable, Product, Renderer } from '../index.ts';

/** События представления каталога. */
export type CatalogViewEvents = {
    /** публикуется при выборе пользователем товара из каталога */
    ['PRODUCT:SELECTED']: { product: Product };
};

/** Тип представления каталога товаров. */
export type CatalogView = Observable<CatalogViewEvents> & Renderer<Product[]>;
