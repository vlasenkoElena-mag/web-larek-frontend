import type { ModalView, ModalViewEvents } from '../../../types/views/base/modal.view';
import {
    ensureElement,
    setChildren,
} from '../../../utils/utils';
import { ObservableObject } from '../../base/observable-object';

/**
 * Параметры для создания `ModalView`.
 * - `modalRoot` — корневой элемент модального окна
 * - `contentContainer` — контейнер внутри модального окна для контента (по умолчанию определяется автоматически)
 * - `closeButton` — элемент, который закрывает модал (по умолчанию ищется по селектору `.modal__close`)
 */
export type ModalViewParams = {
    /** корневой элемент модального окна. */
    rootElement: HTMLElement;
};

/**
 * `ModalView` — базовое представление для модальных окон в приложении.
 * `ModalView` управляет DOM-структурой модального окна: рендерит корневой элемент,
 * вставляет/заменяет содержимое, управляет видимостью и слушает кнопку закрытия.
 *
 * Основные обязанности:
 * - хранить ирендерить `modalRoot`
 * - управлять контейнером для содержимого (`setContentContainer`, `setContent`, `setContentView`)
 * - управлять состоянием видимости (`show` / `hide`) и предоставлять флаг `isOpened`
 */
export class ModalBrowserView extends ObservableObject<ModalViewEvents> implements ModalView {
    /** Корневой элемент модального окна. */
    readonly _rootElement: HTMLElement;

    /** Регистр всех экземпляров модальных окон в приложении. */
    private static _instances: ModalBrowserView[] = [];

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
        super();
        this._rootElement = rootElement;
        this._contentContainer = ensureElement('.modal__content', rootElement);
        this._closeButton = ensureElement('.modal__close', rootElement);

        this._closeButton.addEventListener('click', () => {
            this.hide();
        });

        // Закрывать модал при клике по оверлею (клик вне контейнера модального окна)
        this._rootElement.addEventListener('click', (evt: MouseEvent) => {
            if (evt.target === this._rootElement) {
                this.hide();
            }
        });

        ModalBrowserView._instances.push(this);
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
        // Закрываем все остальные модальные окна перед открытием этого
        ModalBrowserView._instances.forEach(inst => {
            if (inst !== this) {
                inst.hide();
            }
        });

        this._isOpened = true;
        this._rootElement.classList.add('modal_active');
        document.body.classList.add('modal-open');
    }

    /** Скрывает модальное окно и сбрасывает флаг `isOpened`. */
    hide(): void {
        if (this._isOpened) {
            this._emit('MODAL:CLOSED', undefined);
        }

        this._isOpened = false;
        this._rootElement.classList.remove('modal_active');

        // Убираем класс body только если больше нет открытых модальных окон
        const anyOpened = ModalBrowserView._instances.some(i => i !== this && i._isOpened === true);

        if (!anyOpened) {
            document.body.classList.remove('modal-open');
        }
    }
}
