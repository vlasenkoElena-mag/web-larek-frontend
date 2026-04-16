import type { ContactsErrors, CustomerInfo, OrderDetailsErrors, Payment } from '../../types';
import type { CustomerModelEvents } from '../../types/model/model';
import { ObservableObject } from '../base/observable-object';

/**
 * Модель покупателя.
 */
export class CustomerModel extends ObservableObject<CustomerModelEvents> {
    private _email = '';
    private _phone = '';
    private _address = '';
    private _payment: Payment = '';

    /** Возвращает текущее состояние данных покупателя. */
    getCustomerInfo(): CustomerInfo {
        return {
            email: this._email,
            phone: this._phone,
            address: this._address,
            payment: this._payment,
        };
    }

    /** Обновляет текущие данные покупателя и публикует событие изменения. */
    public setData(data: Partial<CustomerInfo>): void {
        if (data.payment !== undefined) {
            this._payment = data.payment;
        }

        if (data.email !== undefined) {
            this._email = data.email;
        }

        if (data.phone !== undefined) {
            this._phone = data.phone;
        }

        if (data.address !== undefined) {
            this._address = data.address;
        }

        this._emit('CUSTOMER:CHANGED', { customerInfo: this.getCustomerInfo() });
    }

    /** Очищает все данные покупателя. */
    public clear(): void {
        this._email = '';
        this._phone = '';
        this._address = '';
        this._payment = '';
        this._emit('CUSTOMER:CHANGED', { customerInfo: this.getCustomerInfo() });
    }

    /** Проверяет валидность данных покупателя и возвращает объект ошибок. */
    public validate(): ContactsErrors & OrderDetailsErrors {
        const errors: ContactsErrors & OrderDetailsErrors = {};

        if (!this._payment) {
            errors.payment = 'Не выбран вид оплаты';
        }

        if (!this._email) {
            errors.email = 'Укажите email';
        }

        if (!this._phone) {
            errors.phone = 'Укажите телефон';
        }

        if (!this._address) {
            errors.address = 'Укажите адрес доставки';
        }

        return errors;
    }
}
