import type { Product } from '../../../types';
import type { CartView, CartViewEvents } from '../../../types/views/cart.view';
import { formatPrice } from '../../../utils/simple-utils';
import { cloneTemplate, ensureElement, setChildren } from '../../../utils/utils';
import { ObservableObject } from '../../base/observable-object';

export class CartBrowserView extends ObservableObject<CartViewEvents> implements CartView {
    private _root: HTMLElement;
    private _emptyMessageEl: HTMLElement;
    private _orderButton: HTMLButtonElement;

    constructor() {
        super();
        this._root = ensureElement('.basket__list') as HTMLElement;
        this._emptyMessageEl = ensureElement('.basket__empty') as HTMLElement;
        const orderButtonRoot = ensureElement('.basket') as HTMLElement;
        this._orderButton = ensureElement('.button', orderButtonRoot) as HTMLButtonElement;
        this._orderButton.addEventListener('click', () => {
            this._emit('BUTTON-CLICK:ORDER-CREATE', undefined);
        });
    }

    render(products: Product[]): void {
        const items: HTMLElement[] = products.map((product, index) => {
            const el = cloneTemplate<HTMLElement>('card-basket');
            const title = ensureElement('.card__title', el);
            const price = ensureElement('.card__price', el);
            const indexEl = ensureElement('.basket__item-index', el);
            const deleteBtn = ensureElement<HTMLButtonElement>('.basket__item-delete', el);
            el.dataset.productId = product.id;

            indexEl.textContent = String(index + 1);
            title.textContent = product.title;
            price.textContent = formatPrice(product.price ?? 0);

            deleteBtn.addEventListener('click', () => {
                this._emit('BUTTON-CLICK:REMOVE-PRODUCT', { productId: product.id });
            });

            return el as HTMLElement;
        });

        if (products.length === 0) {
            this._emptyMessageEl.textContent = 'В корзине пока ничего нет...';
        }
        else {
            this._emptyMessageEl.textContent = '';
        }

        setChildren(this._root, items);
        const totalPrice = products.reduce((sum, p) => sum + (p.price ?? 0), 0);
        const totalPriceEl = ensureElement('.basket__price') as HTMLElement;
        totalPriceEl.textContent = `${formatPrice(totalPrice)}`;
        this._orderButton.disabled = products.length === 0;
    };
}
