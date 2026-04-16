import type { Observable } from '../../../types';
import { MODAL_EVENTS } from '../../../types/views/base/constants';
import type { ModalEventName, ModalViewEvents } from '../../../types/views/base/modal.view';
import type { EventHandler } from '../../base/event-emitter';
import type { ModalBrowserView } from './modal.view';

/** Обертка с методами для модальных окон */

export class ObservableContentModalView<T extends object, C extends Observable<T> = Observable<T>> {
    protected _modal: ModalBrowserView;
    protected _content: C;

    constructor(content: C, modalView: ModalBrowserView) {
        this._modal = modalView;
        this._content = content;
    }

    /**
     *
     * @param event
     * @param handler
     * @returns
     * Подписка на событие
     */

    on<E extends keyof (T & ModalViewEvents)>(
        event: E,
        handler: (payload: (T & ModalViewEvents)[E]) => void,
    ): void {
        if (isModalEvent(event)) {
            this._modal.on(event, handler as EventHandler<ModalViewEvents>);
            return;
        }

        this._content.on(event as keyof T, handler as (payload: T[keyof T]) => void);
    }

    /**
     * Показать модальное окно
     */

    show(): void {
        this._modal.show();
    }

    /**
     * Скрыть модальное окно
     */

    hide(): void {
        this._modal.hide();
    }
}

const isModalEvent = (event: unknown): event is ModalEventName => MODAL_EVENTS.includes(event as ModalEventName);
