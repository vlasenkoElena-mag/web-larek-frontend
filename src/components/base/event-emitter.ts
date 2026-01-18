import { asArray } from '../../utils/simple-utils';

type EventHandler<T extends object, K extends keyof T = keyof T>
    = (payload: T[K]) => void;

type AnyEventHandler<T extends object> = (event: keyof T, payload: T[keyof T]) => void;

type MakeEmitter = <MessageMap extends Record<string, unknown>>() => EventEmitter<MessageMap>;

export const makeEventEmitter: MakeEmitter = () => new EventEmitter();

// Базовый класс для реализации паттерна "Издатель-Подписчик"
export class EventEmitter<MessageMap extends object> {
    #handlers = new Map<keyof MessageMap, Set<EventHandler<MessageMap>>>();
    #allEventsHandler = new Set<AnyEventHandler<MessageMap>>();

    /** Публикует событие */
    emit<T extends keyof MessageMap>(eventName: T, payload: MessageMap[T]) {
        this.#getHandlers(eventName).forEach(handle => handle(payload));
        this.#allEventsHandler.forEach(handle => handle(eventName, payload));
    }

    /**
     * Добавляет обработчик события
     */
    on<T extends keyof MessageMap>(eventName: T | T[], handler: EventHandler<MessageMap, T>) {
        asArray(eventName).forEach(evt => {
            if (!this.#handlers.has(evt)) {
                this.#handlers.set(evt, new Set());
            }

            this.#handlers.get(evt)?.add(handler as EventHandler<MessageMap, keyof MessageMap>);
        });
    }

    /**
     * Снимает обработчик события
     */
    off<T extends keyof MessageMap>(eventName: T, handler: EventHandler<MessageMap, T>) {
        const handlers = this.#handlers.get(eventName);
        handlers?.delete(handler as EventHandler<MessageMap, keyof MessageMap>);

        if (this.#handlers.get(eventName)?.size === 0) {
            this.#handlers.delete(eventName);
        }
    }

    /**
     *  Добавляет обработчик любого события
     */
    onAll(handler: AnyEventHandler<MessageMap>) {
        this.#allEventsHandler.add(handler);
    }

    /**
     * Cбрасывает все обработчики
     */
    reset() {
        this.#handlers = new Map();
        this.#allEventsHandler = new Set();
    }

    #getHandlers(eventName: keyof MessageMap): Set<EventHandler<MessageMap>> {
        return this.#handlers.get(eventName) ?? new Set();
    }
}
