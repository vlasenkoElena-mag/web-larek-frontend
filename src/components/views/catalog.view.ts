import type { CatalogView, CatalogViewEvents } from '../../types/views/catalog.view';
import type { Product } from '../../types';
import { ObservableObject } from '../base/observable-object';
import { ensureElement, cloneTemplate, setChildren } from '../../utils/utils';
import { formatPrice } from '../../utils/simple-utils';

export class CatalogBrowserView extends ObservableObject<CatalogViewEvents> implements CatalogView {
    private _root: HTMLElement;

    constructor() {
        super();
        this._root = ensureElement('.gallery');
    }

    render(products: Product[]): void {
        const items: HTMLElement[] = products.map(product => {
            const el = cloneTemplate<HTMLButtonElement>('card-catalog');

            const category = el.querySelector('.card__category') as HTMLElement | null;
            const title = el.querySelector('.card__title') as HTMLElement | null;
            const image = el.querySelector('.card__image') as HTMLImageElement | null;
            const price = el.querySelector('.card__price') as HTMLElement | null;

            if (category) category.textContent = product.category;
            if (title) title.textContent = product.title;
            if (image) image.src = `/images${product.image}`;
            if (price) price.textContent = formatPrice(product.price ?? 0);

            el.dataset.productId = product.id;

            el.addEventListener('click', () => {
                this.handleCardClick(product.id);
            });

            return el as HTMLElement;
        });

        setChildren(this._root, items);
    }

    private handleCardClick(productId: string): void {
        this._emit('PRODUCT:SELECTED', { productId });
    }
}
