import { OrderApi } from './components/api/order.api';
import { ProductApi } from './components/api/product.api';
import { CartModel } from './components/models/cart.model';
import { CatalogModel } from './components/models/catalog.model';
import { CustomerModel } from './components/models/customer.model';
import { CatalogPresenter } from './components/presenters/catalog.presenter';
import { CartModalBrowserView } from './components/views/cart/cart-modal-view';
import { CatalogBrowserView } from './components/views/catalog.view';
import { ContactsModalBrowserView } from './components/views/contacts-modal.view';
import { HeaderBrowserView } from './components/views/header.view';
import { OrderCreationResultBrowserView } from './components/views/order-creation-result.view';
import { OrderDetailsModalBrowserView } from './components/views/order-details-modal.view';
import { ProductModalBrowserView } from './components/views/product/product-modal.view';
import { BASE_API_URL } from './config/api-config';
import './scss/styles.scss';

const productApi = new ProductApi(BASE_API_URL);

const run = async () => {
    const presenter = new CatalogPresenter({
        catalogModel: new CatalogModel(productApi),
        cartModel: new CartModel(),
        customerModel: new CustomerModel(),
        cartView: new CartModalBrowserView(),
        catalogView: new CatalogBrowserView(),
        orderDetailsView: new OrderDetailsModalBrowserView(),
        productModalView: new ProductModalBrowserView(),
        contactsView: new ContactsModalBrowserView(),
        // orderCreationResultView: new OrderCreationResultBrowserView(),
        orderApi: new OrderApi(BASE_API_URL),
        headerView: new HeaderBrowserView(),
    });

    presenter.init();
};

run();
