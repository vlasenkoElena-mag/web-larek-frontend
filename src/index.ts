import { OrderApi } from './components/api/order.api';
import { ProductApi } from './components/api/product.api';
import { CartModel } from './components/models/cart.model';
import { CatalogModel } from './components/models/catalog.model';
import { CustomerModel } from './components/models/customer.model';
import { CatalogPresenter } from './components/presenters/catalog.presenter';
import { CartBrowserView } from './components/views/cart.view';
import { CatalogBrowserView } from './components/views/catalog.view';
import { ContactsBrowserView } from './components/views/contacts.view';
import { OrderCreationResultBrowserView } from './components/views/order-creation-result.view';
import { OrderDetailsBrowserView } from './components/views/order-details.view';
import { ProductModalBrowserView } from './components/views/product/product-modal.view';
import { BASE_API_URL } from './config/api-config';
import './scss/styles.scss';

const productApi = new ProductApi(BASE_API_URL);

const run = async () => {
    const { error, products } = await productApi.getAll();

    if (error) {
        throw error;
    }

    const presenter = new CatalogPresenter({
        catalogModel: new CatalogModel(products),
        cartModel: new CartModel(),
        customerModel: new CustomerModel(),
        cartView: new CartBrowserView(), // не реализовано
        catalogView: new CatalogBrowserView(),
        orderDetailsView: new OrderDetailsBrowserView(), // не реализовано
        productModalView: new ProductModalBrowserView(),
        contactsModalView: new ContactsBrowserView(), // не реализовано
        orderCreationResultView: new OrderCreationResultBrowserView(), // не реализовано
        orderApi: new OrderApi(BASE_API_URL)
    });

    presenter.init();
};

run();