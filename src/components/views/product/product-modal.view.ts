import type {
    ProductCardView,
    ProductModalView,
    ProductViewEvents,
} from '../../../types/views/product.view';
import { ensureElement } from '../../../utils/utils';
import { ModalBrowserView } from '../common/modal.view';
import { ObservableContentModalView } from '../common/observable-content-modal.view';
import { ProductCardBrowserView } from './product-card.view';

/**
 * Браузерная реализация `ProductModalView`.
 * Декорирует ProductCardView логикой модального окна.
 */
export class ProductModalBrowserView extends ObservableContentModalView<ProductViewEvents, ProductCardBrowserView> implements ProductModalView {
    constructor() {
        const modalRoot = document.getElementById('product-modal') as HTMLElement;

        /**
         * Замечание: "По правилам ООП и MVP в одних классах не должны создаваться экземпляры других классов,
         *  чтобы не было жёсткой зависимости одного класса от другого, классы могли быть заменяемыми
         *  в текущем проекте, и переиспользуемыми в других проектах."
         *
         * Комментарий: Принцип инверсии зависимостей (DIP) применяется к тем зависимостям, которые являются проблемными
         * (например затрудняющие тестирование логики зависимости презентера от dom елементов), а не ко всему подряд.
         * ProductModalBrowserView является сугубо специфачным представлением для данного проекта и не предполагает переиспользования.
         * Переиспользовани предполагают такие классы как ModalBrowserView (те что в common)
         *
         * Предлагаемый подход (презентер это не класс, а индекс файл) делает из беспроблемных зависимостей (view от view) проблемные (например презентер от dom),
         * что делает тестирование логики презентера затруднительным, так как необходимо создавать реальные dom элементы, что по сути превращает юнит тесты в интеграционные.
         */
        super(
            new ProductCardBrowserView({ productCardElement: ensureElement('.card_full', modalRoot) }),
            new ModalBrowserView({ rootElement: modalRoot }),
        );
    }

    private get _productCardView() {
        return this._content;
    }

    /** Рендерит данные в карточку товара и показывает модальное окно. */
    render(params: Parameters<ProductCardView['render']>[0]): void {
        this._productCardView.render(params);
        this.show();
    }

    /** Устанавливает состояние кнопки покупки товара. */
    public setAddToCartButtonState(disabled: boolean): void {
        this._productCardView.setAddToCartButtonState(disabled);
    }
}
