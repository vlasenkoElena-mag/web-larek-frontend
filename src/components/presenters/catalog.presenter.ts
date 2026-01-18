import type { ProductId } from '../../types';
import { type CartView } from '../../types/views/cart.view';
import type { CatalogView } from '../../types/views/catalog.view';
import type { ContactsView } from '../../types/views/contacts.view';
import type { OrderDetailsView } from '../../types/views/order-details.view';
import { type ProductView } from '../../types/views/product.view';
import type { CatalogModel } from '../models/catalog.model';
import type { OrderModel } from '../models/order.model';

/**
 * Зависимости `CatalogPresenter`.
 * Модели и представления, с которыми работает презентер.
 */
export type Deps = {
    /** модель каталога */
    catalogModel: CatalogModel;
    /** модель заказа */
    orderModel: OrderModel;
    /** представление каталога */
    catalogView: CatalogView;
    /** представление модального окна показа товара */
    productModalView: ProductView;
    /** представление модальной формы для ввода деталей заказа */
    orderDetailsView: OrderDetailsView;
    /** представление модальной формы для ввода контактных данных */
    contactsModalView: ContactsView;
    /** представление корзины товаров */
    cartView: CartView;
};

/**
 * Презентер каталога.
 * Отвечает за связку `CatalogModel`, `OrderModel` и соответствующих представлений,
 * маршрутизирует события между ними, и обновляет модели и представления.
 */
export class CatalogPresenter {
    private _catalogModel: CatalogModel;
    private _orderModel: OrderModel;
    private _catalogView: CatalogView;
    private _productView: ProductView;
    private _orderDetailView: OrderDetailsView;
    private _contactsView: ContactsView;
    private _cartView: CartView;

    private _cartProductIds = new Set<ProductId>();

    /**
     * Создаёт экземпляр `CatalogPresenter`.
     * @param deps - Набор зависимостей, необходимых презентеру.
     */
    constructor(deps: Deps) {
        const {
            catalogModel,
            orderModel,
            catalogView,
            productModalView,
            orderDetailsView,
            contactsModalView,
            cartView,
        } = deps;

        this._catalogView = catalogView;
        this._productView = productModalView;
        this._orderDetailView = orderDetailsView;
        this._contactsView = contactsModalView;
        this._cartView = cartView;
        this._catalogModel = catalogModel;
        this._orderModel = orderModel;
    }

    /**
     * Инициализирует презентер: подписывается на события моделей и представлений,
     * связывает их между собой и запускает отображение каталога при загрузке.
     */
    init() {
        this._catalogModel.on('PRODUCTS:LOADED', ({ products }) => {
            this._catalogView.render(products);
        });

        this._catalogView.on(
            'PRODUCT:SELECTED',
            ({ productId }) => this._catalogModel.selectProduct(productId),
        );

        this._catalogModel.on('PRODUCT:SELECTED', ({ product }) => {
            this._productView.render({
                product,
                disableButton: this._cartProductIds.has(product.id),
            });
        });

        this._productView.on('BUTTON-CLICK:BUY', ({ product }) => {
            this._orderModel.addProduct(product);
        });

        this._orderModel.on('CART:UPDATED', ({ products }) => {
            this._cartView.render(products);
        });

        this._cartView.on('BUTTON-CLICK:REMOVE-PRODUCT', ({ productId }) => {
            this._orderModel.removeProduct(productId);
        });

        this._cartView.on('BUTTON-CLICK:ORDER-CREATE', () => {
            this._orderDetailView.show(this._orderModel.orderDetails);
        });

        this._orderDetailView.on('FORM-SUBMIT', orderDetails => {
            this._orderModel.setOrderDetails(orderDetails);
            this._contactsView.show(this._orderModel.contacts);
        });

        this._contactsView.on('FORM-SUBMIT', contacts => {
            this._orderModel.setContacts(contacts);
            this._orderModel.createOrder();
        });

        this._orderModel.on('ORDER:CREATED', order => {
            console.log('order:', order); // TODO remove after first stage would be done
            this._contactsView.hide();
        });
    }
}

export const makeCatalogPresenter = (deps: Deps) => new CatalogPresenter(deps);
