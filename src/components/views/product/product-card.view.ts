import type { Product } from '../../../types';
import { ensureElement } from '../../../utils/utils';
import { formatPrice } from '../../../utils/simple-utils';
import { ObservableObject } from '../../base/observable-object';
import type { ProductModalViewEvents, ProductCardView } from '../../../types/views/product.view';

/** Параметры для создания представления продукта. */
export type ProductViewParams = {
    /** корневой HTML-элемент карточки товара */
    productCardElement: HTMLElement;
};

/**
 * Представление детальной информации о товаре (MVP паттерн).
 *
 * `ProductBrowserView` отвечает за отображение полной информации о товаре в модальном окне
 * или отдельной странице. Класс управляет DOM-элементами карточки продукта, наполняет их данными
 * и обрабатывает взаимодействие пользователя с кнопкой покупки.
 *
 * Основной функционал:
 * - Инициализация и кэширование ссылок на DOM-элементы карточки товара
 * - Заполнение данных товара (название, категория, цена, описание, изображение)
 * - Обработка клика по кнопке "Купить" с эмиссией события `buy_button_click`
 * - Управление состоянием кнопки покупки (активна/неактивна)
 * - Рендеринг карточки в целевой контейнер
 */
export class ProductCardBrowserView extends ObservableObject<ProductModalViewEvents> implements ProductCardView {
    /** Корневой элемент карточки товара */
    public readonly element: HTMLElement;

    /** текущий отображаемй продукт */
    private _product: Product | null;

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

    /**
     * Создаёт экземпляр представления товара.
     *
     * Конструктор выполняет следующие действия:
     * 1. Сохраняет ссылку на корневой элемент
     * 2. Находит и кэширует все дочерние элементы карточки по CSS-селекторам
     * 3. Устанавливает обработчики событий DOM-елементов.
     */
    constructor({ productCardElement }: ProductViewParams) {
        super();
        this.element = productCardElement;
        this._priceElement = ensureElement('.card__price', productCardElement);
        this._categoryElement = ensureElement('.card__category', productCardElement);
        this._descriptionElement = ensureElement('.card__text', productCardElement);
        this._titleElement = ensureElement('.card__title', productCardElement);
        this._imageElement = (ensureElement('.card__image', productCardElement) as HTMLImageElement);
        this._buyButtonElement = ensureElement('.button', productCardElement) as HTMLButtonElement;
        this._product = null;

        this._buyButtonElement.addEventListener('click', () => {
            this._emit('BUTTON-CLICK:BUY', this._makeBuyButtonClickPayload());
        });
    }

    /**
     * Устанавливает текущий отображаемый продукт, отображает его данные в DOM-елементы.
     */
    render(product: Product) {
        this._product = product;
        this._renderProduct(product);
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
    setButtonDisabledState(disabled: boolean) {
        this._buyButtonElement.disabled = disabled;
    }

    private _renderProduct({ title, category, price, description, image }: Product) {
        this._categoryElement.textContent = category;
        this._priceElement.textContent = price === null ? 'Не продается' : formatPrice(price ?? 0);
        this._titleElement.textContent = title;
        this._descriptionElement.textContent = description;
        this._imageElement.src = `/images${image}`;

        if (price === null) {
            this._buyButtonElement.disabled = true;
        }
    }

    private _makeBuyButtonClickPayload(): ProductModalViewEvents['BUTTON-CLICK:BUY'] {
        if (this._product === null) {
            throw new Error('Application logic error: publishing product-related event when product is null');
        }

        return { product: this._product };
    }
}
