import { ObservableObject } from '../base/observable-object';

export type HeaderViewEvents = { 'BASKET:OPEN': null };

export class HeaderBrowserView extends ObservableObject<HeaderViewEvents> {
    private _button: HTMLButtonElement;

    constructor() {
        super();
        this._button = document.querySelector('.header__basket') as HTMLButtonElement;
        this._button.addEventListener('click', () => {
            this._emit('BASKET:OPEN', null);
        });
    }
}

export type HeaderView = HeaderBrowserView;
