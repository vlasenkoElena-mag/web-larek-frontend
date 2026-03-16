import type { Observable } from '../../types';
import type { EventHandler } from './event-emitter';
import { EventEmitter } from './event-emitter';

/**
 * Базовый класс наблюдаемого объекта, которые эмитят события и предоставляют метод для подписки на них.
 *
 * @template EventMap Тип-отображения имён событий на публикуемые данные
 */
export class ObservableObject<EventMap extends Record<string, unknown>> implements Observable<EventMap> {
    private _emitter = new EventEmitter<EventMap>();

    /**
     * Добавляет обработчик события
     */
    on<E extends keyof EventMap>(eventName: E | E[], handler: EventHandler<EventMap, E>) {
        this._emitter.on(eventName, handler);
    }

    /** Публикует событие */
    protected _emit<EventName extends keyof EventMap>(eventName: EventName, payload: EventMap[EventName]) {
        this._emitter.emit(eventName, payload);
    }
}
