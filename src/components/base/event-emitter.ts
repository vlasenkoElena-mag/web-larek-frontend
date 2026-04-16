import { asArray } from '../../utils/simple-utils';

export type EventHandler<T extends object, K extends keyof T = keyof T>
    = (payload: T[K]) => void;

type AnyEventHandler<T extends object> = (event: keyof T, payload: T[keyof T]) => void;
type MakeEmitter = <MessageMap extends Record<string, unknown>>() => EventEmitter<MessageMap>;

export const makeEventEmitter: MakeEmitter = () => new EventEmitter();

// Базовый класс для реализации паттерна "Издатель-Подписчик"
export class EventEmitter<MessageMap extends object> {
    private _handlers = new Map<keyof MessageMap, Set<EventHandler<MessageMap>>>();
    private _allEventsHandler = new Set<AnyEventHandler<MessageMap>>();

    /** Публикует событие */
    emit<T extends keyof MessageMap>(eventName: T, payload: MessageMap[T]) {
        this._getHandlers(eventName).forEach(handle => handle(payload));
        this._allEventsHandler.forEach(handle => handle(eventName, payload));
    }

    /**
     * Добавляет обработчик события
     */
    on<T extends keyof MessageMap>(eventName: T | T[], handler: EventHandler<MessageMap, T>) {
        asArray(eventName).forEach(evt => {
            if (!this._handlers.has(evt)) {
                this._handlers.set(evt, new Set());
            }

            this._handlers.get(evt)?.add(handler as EventHandler<MessageMap, keyof MessageMap>);
        });
    }

    /**
     * Снимает обработчик события
     */
    off<T extends keyof MessageMap>(eventName: T, handler: EventHandler<MessageMap, T>) {
        const handlers = this._handlers.get(eventName);
        handlers?.delete(handler as EventHandler<MessageMap, keyof MessageMap>);

        if (this._handlers.get(eventName)?.size === 0) {
            this._handlers.delete(eventName);
        }
    }

    /**
     *  Добавляет обработчик любого события
     */
    onAll(handler: AnyEventHandler<MessageMap>) {
        this._allEventsHandler.add(handler);
    }

    /**
     * Cбрасывает все обработчики
     */
    reset() {
        this._handlers = new Map();
        this._allEventsHandler = new Set();
    }
    /**
     * Получает обработчики для события
     */

    _getHandlers(eventName: keyof MessageMap): Set<EventHandler<MessageMap>> {
        return this._handlers.get(eventName) ?? new Set();
    }
}
