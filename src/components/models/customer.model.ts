import type { OrderDetails, Contacts, CustomerInfo, Payment } from '../../types';
import { InvalidCustomerInfoError } from '../api/errors/invalid-customer-info-error';

/**
 * Модель покупателя.
 */
export class CustomerModel {
    private _email = '';
    private _phone = '';
    private _address = '';
    private _payment: Payment = '';

    get contacts(): Contacts {
        return {
            email: this._email,
            phone: this._phone,
        };
    }

    get orderDetails(): OrderDetails {
        return {
            address: this._address,
            payment: this._payment,
        };
    }

    /** Возвращает копию деталей заказа если все данные валидны, иначе пробрасывает ошибку. */
    getValidCustomerInfo(): CustomerInfo {
        const info: CustomerInfo = {
            email: this._email,
            phone: this._phone,
            address: this._address,
            payment: this._payment,
        };

        this._validate(info);

        return info;
    }

    /** Устанавливает детали заказа адрес и способ оплаты выбранные покупателей. */
    public setOrderDetails({ address, payment }: OrderDetails) {
        this._address = address;
        this._payment = payment;
    }

    /** Устанавливает контактные данные покупателя. */
    public setContacts({ email, phone }: Contacts) {
        this._email = email;
        this._phone = phone;
    }

    /** проверяет валидность данных покупателя. */
    private _validate(customerInfo: CustomerInfo): void {
        const { email, phone, address, payment } = customerInfo;

        if (!email || !phone || !address || !payment) {
            throw new InvalidCustomerInfoError(customerInfo);
        }
    }
}
