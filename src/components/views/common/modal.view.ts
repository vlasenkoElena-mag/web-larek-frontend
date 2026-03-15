import {
    ensureElement,
    setChildren,
} from '../../../utils/utils';

/**
 * Параметры для создания `ModalView`.
 * - `modalRoot` — корневой элемент модального окна
 * - `contentContainer` — контейнер внутри модального окна для контента (по умолчанию определяется автоматически)
 * - `closeButton` — элемент, который закрывает модал (по умолчанию ищется по селектору `.modal__close`)
 */
export type ModalViewParams = {
    /** корневой элементмодального окна. */
    rootElement: HTMLElement;
};

/**
 * Простая реализация модального окна для браузера.
 *
 * `ModalView` управляет DOM-структурой модального окна: рендерит корневой элемент,
 * вставляет/заменяет содержимое, управляет видимостью и слушает кнопку закрытия.
 *
 * Основные обязанности:
 * - хранить ирендерить `modalRoot`
 * - управлять контейнером для содержимого (`setContentContainer`, `setContent`, `setContentView`)
 * - управлять состоянием видимости (`show` / `hide`) и предоставлять флаг `isOpened`
 */
export class ModalBrowserView {
    /** Корневой элемент модального окна. */
    readonly _rootElement: HTMLElement;

    /** Элемент контейнера для содержимого модального окна. */
    _contentContainer: HTMLElement;

    /** Кнопка закрытия модального окна. */
    _closeButton: HTMLElement;

    /** Флаг состояния — открыт ли модал. */
    _isOpened = false;

    /**
     * Создаёт `ModalView` и настраивает контейнер и слушателей.
     * @param params Параметры и DOM-элементы для инициализации модального окна
     */
    constructor({ rootElement }: ModalViewParams) {
        this._rootElement = rootElement;
        this._contentContainer = ensureElement('.modal__content', rootElement);
        this._closeButton = ensureElement('.modal__close', rootElement);

        this._closeButton.addEventListener('click', () => {
            this._rootElement.classList.remove('modal_active');
            document.body.classList.remove('modal-open');
        });
    }

    /** Возвращает текущее состояние видимости модального окна. */
    get isOpened(): boolean {
        return this._isOpened;
    }

    /** Заменяет содержимое контейнера указанными элементами. */
    setContent(...elements: HTMLElement[]): void {
        setChildren(this._contentContainer, elements);
    }

    /** Показывает модальное окно и выставляет внутренний флаг `isOpened`. */
    show(): void {
        this._isOpened = true;
        this._rootElement.classList.add('modal_active');
        document.body.classList.add('modal-open');
    }

    /** Скрывает модальное окно и сбрасывает флаг `isOpened`. */
    hide(): void {
        this._isOpened = false;
        this._rootElement.classList.remove('modal_active');
        document.body.classList.remove('modal-open');
    }
}
