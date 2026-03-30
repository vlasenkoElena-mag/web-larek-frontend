import { ensureElement } from '../../utils/utils';
import { ObservableObject } from '../base/observable-object';

export type HeaderViewEvents = { 'BASKET:OPEN': null };

export class HeaderBrowserView extends ObservableObject<HeaderViewEvents> {
    private _button: HTMLButtonElement;
    private _buttonCounterElement: HTMLElement;

    constructor() {
        super();
        this._button = ensureElement('.header__basket') as HTMLButtonElement;

        this._button.addEventListener('click', () => {
            this._emit('BASKET:OPEN', null);
        });

        const counterElement = ensureElement('.header__basket-counter', this._button);
        this._buttonCounterElement = counterElement as HTMLElement;
        this._buttonCounterElement.textContent = '0';
    }

    setCartCounter(count: number): void {
        if (this._buttonCounterElement) {
            this._buttonCounterElement.textContent = String(count);
        }
    }
}

export type HeaderView = HeaderBrowserView;
