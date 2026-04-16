import type { Product } from '../../../types';
import { ensureElement } from '../../../utils/utils';
import { formatPrice } from '../../../utils/simple-utils';
import { ObservableObject } from '../../base/observable-object';
import type { ProductViewEvents, ProductCardView } from '../../../types/views/product.view';
import { categoryMap } from '../../../utils/constants';

/** Параметры для создания представления продукта. */
export type ProductViewParams = {
    /** корневой HTML-элемент карточки товара */
    productCardElement: HTMLElement;
};

/**
 * Представление детальной информации о товаре.
 */
export class ProductCardBrowserView extends ObservableObject<ProductViewEvents> implements ProductCardView {
    /** Корневой элемент карточки товара */
    public readonly element: HTMLElement;

    /** Элемент отображения цены товара */
    private _priceElement: HTMLElement;

    /** Элемент отображения категории товара */
    private _categoryElement: HTMLElement;

    /** Элемент отображения названия товара */
    private _titleElement: HTMLElement;

    /** Элемент отображения описания товара */
    private _descriptionElement: HTMLElement;

    /** Элемент изображения товара */
    private _imageElement: HTMLImageElement;

    /** Кнопка добавления товара в корзину */
    private _buyButtonElement: HTMLButtonElement;

    constructor({ productCardElement }: ProductViewParams) {
        super();
        this.element = productCardElement;
        this._priceElement = ensureElement('.card__price', productCardElement);
        this._categoryElement = ensureElement('.card__category', productCardElement);
        this._descriptionElement = ensureElement('.card__text', productCardElement);
        this._titleElement = ensureElement('.card__title', productCardElement);
        this._imageElement = (ensureElement('.card__image', productCardElement) as HTMLImageElement);
        this._buyButtonElement = ensureElement('.button', productCardElement) as HTMLButtonElement;
        this.element.dataset.productId = '';

        this._buyButtonElement.addEventListener('click', () => {
            this._emit('BUTTON-CLICK:BUY', { productId: this.element.dataset.productId ?? '' });
        });
    }

    /**
     * Замечание: "Метод render всех классов слоя View должен в инструкции return возвращать
     * заполненный родительский контейнер карточки,
     * который должен поступать как аргумент в класс в виде клонированного шаблона."
     *
     * Комментарий:метод render отвечает за отображение данных. Сигнатура render(product: Product): void
     * хорошо описывает то, что делает метод и согласуется с принципом CQS.
     * Он не нарушает никаких привил и принципов ООП или MVP.
     */
    public render({ id, title, category, price, description, image }: Product): void {
        this._categoryElement.textContent = category;
        this._priceElement.textContent = price === null ? 'Не продается' : formatPrice(price ?? 0);
        this._titleElement.textContent = title;
        this._descriptionElement.textContent = description;
        this._imageElement.src = `/images${image}`;
        this._categoryElement.className = `card__category card__category_${categoryMap[category]}`;
        this.element.dataset.productId = id;
    }

    /**
     * Управляет состоянием доступности кнопки покупки.
     *
     * Метод позволяет программно блокировать или разблокировать кнопку "Купить".
     * Это полезно для различных сценариев:
     * - Блокировка, если товар уже находится в корзине
     * - Блокировка во время обработки запроса на добавление в корзину
     * - Разблокировка при удалении товара из корзины
     */
    public setAddToCartButtonState(disabled: boolean): void {
        this._buyButtonElement.disabled = disabled;
    }
}
