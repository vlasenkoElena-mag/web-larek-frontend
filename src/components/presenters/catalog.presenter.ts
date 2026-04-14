import type { CreateOrderResult, OrderApi } from '../../types/api/order.api';
import type { CartModel } from '../../types/model/model';
import type { CartModalView } from '../../types/views/cart.view';
import type { CatalogView } from '../../types/views/catalog.view';
import type { ContactsModalView } from '../../types/views/contacts.view';
import type { OrderCreationResultModalView } from '../../types/views/order-creation-result.view';
import type { OrderDetailsModalView } from '../../types/views/order-details.view';
import { type ProductCardView } from '../../types/views/product.view';
import type { CatalogModel } from '../models/catalog.model';
import type { CustomerModel } from '../models/customer.model';
import type { HeaderView } from '../views/header.view';

/**
 * Зависимости `CatalogPresenter`.
 * Модели и представления, с которыми работает презентер.
 */
export type Deps = {
    /** модель корзины */
    cartModel: CartModel;
    /** модель каталога */
    catalogModel: CatalogModel;
    /** модель покупателя */
    customerModel: CustomerModel;
    /** API заказа */
    orderApi: OrderApi;
    /** представление каталога */
    catalogView: CatalogView;
    /** представление модального окна показа товара */
    productModalView: ProductCardView;
    /** представление модального окна для ввода деталей заказа */
    orderDetailsView: OrderDetailsModalView;
    /** представление модального окна для ввода контактных данных */
    contactsView: ContactsModalView;
    /** представление корзины товаров */
    cartView: CartModalView;
    /** представление результата создания заказа. */
    orderCreationResultView: OrderCreationResultModalView;
    /** представление хедера. */
    headerView: HeaderView;
};

/** Презентер каталога. */
export class CatalogPresenter {
    private _cartModel: CartModel;
    private _catalogModel: CatalogModel;
    private _customerModel: CustomerModel;
    private _catalogView: CatalogView;
    private _productView: ProductCardView;
    private _orderDetailsView: OrderDetailsModalView;
    private _contactsView: ContactsModalView;
    private _cartView: CartModalView;
    private _orderCreationResultView: OrderCreationResultModalView;
    private _orderApi: OrderApi;
    private _headerView: HeaderView;

    /**
     * Создаёт экземпляр `CatalogPresenter`.
     * @param deps - Набор зависимостей, необходимых презентеру.
     */
    constructor(deps: Deps) {
        const {
            cartModel,
            catalogModel,
            customerModel,
            catalogView,
            productModalView,
            orderDetailsView,
            contactsView,
            cartView,
            orderCreationResultView,
            orderApi,
            headerView,
        } = deps;

        this._catalogView = catalogView;
        this._productView = productModalView;
        this._orderDetailsView = orderDetailsView;
        this._contactsView = contactsView;
        this._cartView = cartView;
        this._cartModel = cartModel;
        this._customerModel = customerModel;
        this._catalogModel = catalogModel;
        this._orderCreationResultView = orderCreationResultView;
        this._orderApi = orderApi;
        this._headerView = headerView;
    }

    /**
     * Инициализирует презентер: подписывается на события моделей и представлений,
     * связывает их между собой и запускает отображение каталога при загрузке.
     */
    init() {
        this._catalogModel.on('PRODUCTS:LOADED', ({ products }) => {
            this._catalogView.render(products);
        },
        );
        this._catalogModel.loadProducts();

        this._catalogView.on(
            'PRODUCT:SELECTED',
            ({ product }) => {
                this._catalogModel.setPreview(product);
                this._productView.setButtonDisabledState(this._cartModel.has(product.id));
            },
        );

        this._catalogModel.on('PREVIEW:UPDATED', ({ preview }) => {
            this._productView.render(preview);
        });

        this._headerView.on('BASKET:OPEN', () => {
            this._cartView.render(this._cartModel.products || []);
            this._cartView.show();
        });

        this._productView.on('BUTTON-CLICK:BUY', ({ product }) => {
            this._cartModel.addProduct(product);
            this._productView.setButtonDisabledState(true);
        });

        this._cartView.on('BUTTON-CLICK:REMOVE-PRODUCT', ({ productId }) => {
            this._cartModel.removeProduct(productId);
            this._productView.setButtonDisabledState(false);
        });

        this._cartView.on('BUTTON-CLICK:ORDER-CREATE', () => {
            this._cartView.hide();
            this._orderDetailsView.show();
        });

        this._cartModel.on('CART:UPDATED', ({ products }) => {
            this._headerView.setCartCounter(products.length);
            this._cartView.render(products || []);
        });

        this._orderDetailsView.on('FORM-CHANGED', ({ data, isValid }) => {
            if (isValid) {
                this._customerModel.setOrderDetails(data);
                this._orderDetailsView.setOrderButtonDisabledState(!isValid);
            }
        });

        this._orderDetailsView.on('FORM-SUBMIT', () => {
            this._contactsView.show();
        });

        this._contactsView.on('FORM-CHANGED', ({ data, isValid }) => {
            if (isValid) this._customerModel.setContacts(data);
        });

        this._contactsView.on('FORM-SUBMIT', async () => {
            const { error, order } = await this._createOrder();

            if (error) {
                throw error;
            }

            this._orderCreationResultView.render(order.total);
            this._cartModel.clear();
            this._customerModel.clear();
        });
    }

    private _createOrder(): Promise<CreateOrderResult> {
        return this._orderApi.create({
            ...this._cartModel.getValidItems(),
            ...this._customerModel.getValidCustomerInfo(),
        });
    }
}
