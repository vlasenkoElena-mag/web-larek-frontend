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

    /**
     * Замечание: Как сказано в комментарии в классе CatalogBrowserView,
     * его метод render должен быть преобразован: массив HTML-элементов,
     * который этот метод должен выводить на экран, нужно формировать в обработчике события 'PRODUCTS:LOADED'.
     *
     * Комментарий: вынос логики создания items в презентер по шаблону
     *
     * events.on('catalog:changed', () => {
     *      const itemCards = productsModel.getItems().map((item) => {
     *           const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
     *       });
     *       this._catalogView.render(itemCards);
     * });
     * неприемлем в данной архитектуре, так как создает неприемлемую зависимость презентера от dom элементов (что, в частности, усложняет unit-тестирование логики презентера).
     * Сейчас презентер является независимым от любых проблемных элементов (dom, api).
     * Работа с Dom элементами в слое view, в частности создание items не нарушает архитектурных принципов MVP.
     */
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
                this._emit('PRODUCT:SELECTED', { productId: product.id });
            });

            return el as HTMLElement;
        });

        setChildren(this._root, items);
    }
}
