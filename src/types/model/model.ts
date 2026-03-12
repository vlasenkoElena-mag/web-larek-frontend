import type { Observable, Product } from '../index.ts';

/** События модели продуктов. */
export type ProductsModelEvents = {
    /** публикуется при загрузке всех продуктов каталога */
    ['PRODUCTS:LOADED']: { products: Product[] };
    ['PRODUCT:SELECTED']: { product: Product };
};

/** Тип модели продуктов. */
export type ProductsModel = Observable<ProductsModelEvents>;
