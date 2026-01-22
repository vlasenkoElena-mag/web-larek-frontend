import { OrderApi } from './components/api/order.api.js';
import { ProductApi } from './components/api/product.api.js';
import { CartModel } from './components/models/cart.model.js';
import { CatalogModel } from './components/models/catalog.model.js';
import { CustomerModel } from './components/models/customer.model.js';
import { CatalogPresenter } from './components/presenters/catalog.presenter.js';
import { CartBrowserView } from './components/views/cart.view.js';
import { CatalogBrowserView } from './components/views/catalog.view.js';
import { ContactsBrowserView } from './components/views/contacts.view.js';
import { OrderCreationResultBrowserView } from './components/views/order-creation-result.view.js';
import { OrderDetailsBrowserView } from './components/views/order-details.view.js';
import { ProductModalBrowserView } from './components/views/product/product-modal.view.js';
import { BASE_API_URL } from './config/api-config.js';

const productApi = new ProductApi(BASE_API_URL);

const run = async () => {
    const { error, products} = await productApi.getAll();

    if (error) {
        throw error;
    }

    const presenter = new CatalogPresenter({
        catalogModel: new CatalogModel(products),
        cartModel: new CartModel(),
        customerModel: new CustomerModel(),
        cartView: new CartBrowserView(), // не реализовано
        catalogView: new CatalogBrowserView(), // не реализовано
        orderDetailsView: new OrderDetailsBrowserView(), // не реализовано
        productModalView: new ProductModalBrowserView(),
        contactsModalView: new ContactsBrowserView(), // не реализовано
        orderCreationResultView: new OrderCreationResultBrowserView(), // не реализовано
        orderApi: new OrderApi(BASE_API_URL)
    });

    presenter.init();
};

run();