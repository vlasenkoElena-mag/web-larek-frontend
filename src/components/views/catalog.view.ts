import type { CatalogView, CatalogViewEvents } from '../../types/views/catalog.view';
import type { Product } from '../../types';
import { ObservableObject } from '../base/observable-object';
import { ensureElement, cloneTemplate, setChildren } from '../../utils/utils';
import { formatPrice } from '../../utils/simple-utils';
import { categoryMap } from '../../utils/constants';

export class CatalogBrowserView extends ObservableObject<CatalogViewEvents> implements CatalogView {
    private _root: HTMLElement;

    constructor() {
        super();
        this._root = ensureElement('.gallery');
    }

    render(products: Product[]): void {
        const items: HTMLElement[] = products.map(product => {
            const el = cloneTemplate<HTMLElement>('card-catalog');

            const category = ensureElement('.card__category', el);
            const title = ensureElement('.card__title', el);
            const image = ensureElement<HTMLImageElement>('.card__image', el);
            const price = ensureElement('.card__price', el);

            category.textContent = product.category;
            category.className = `card__category card__category_${categoryMap[product.category] || 'other'}`;
            title.textContent = product.title;
            image.src = `/images${product.image}`;
            price.textContent = formatPrice(product.price ?? 0);

            el.dataset.productId = product.id;

            el.addEventListener('click', () => {
                this._handleCardClick(product);
            });

            return el as HTMLElement;
        });

        setChildren(this._root, items);
    }

    private _handleCardClick(product: Product): void {
        this._emit('PRODUCT:SELECTED', { product });
    }
}
