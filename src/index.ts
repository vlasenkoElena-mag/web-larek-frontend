import { makeProductApi } from './components/api/product.api';
import { makeCartController } from './components/controllers/order.controller';
import { makeCatalogController } from './components/controllers/catalog.controller';
import { makeChannels } from './components/events/channels';
import { makeCart } from './components/models/order.model';
import { makeCatalog } from './components/models/catalog.model';
import { makeCatalogPresenter } from './components/presenters/catalog.presenter';
import { makeCartView } from './components/views/cart/cart.view';
import { makeCartProductViewFactory } from './components/views/cart/cart-product-element.factory';
import { makeCatalogCardFactory } from './components/views/catalog/catalog-card.factory';
import { makeCatalogView } from './components/views/catalog/catalog.view';
import { makeProductModalView } from './components/views/product/product-modal.view';

import './scss/styles.scss';
import { makeFakeOrderApi } from './test/test-utils/api-fakes';
import { cloneTemplate, ensureElement, getTemplateFirstChild } from './utils/utils';
import { makeFromModalView } from './components/views/common/form-modal.view';
import { makeModalViewFactory } from './components/views/common/modal-view.factory';
import type { ProductView } from './types/views/product.view';
import { makeListView } from './components/views/common/list.view';
import { makeProductView } from './components/views/product/product.view';
import { makeCartButtonView } from './components/views/cart/cart-button.view';
import { makeButtonView } from './components/views/common/button.view';

const channels = makeChannels();

const catalog = makeCatalog();
const cart = makeCart();

const catalogController = makeCatalogController({
    catalog,
    productApi: makeProductApi(),
    ...channels,
});

catalogController.init();

const cartController = makeCartController({
    cart,
    orderApi: makeFakeOrderApi(),
    ...channels,
});

cartController.init();

const productCardFactory = makeCatalogCardFactory({
    prototypeElement: (ensureElement('#card-catalog') as HTMLTemplateElement).content.firstElementChild as HTMLElement,
});

const catalogView = makeCatalogView({
    productCardFactory,
    productsView: makeListView({
        container: ensureElement('.gallery'),
    }),
});

const modalViewFactory = makeModalViewFactory({
    modalRootPrototype: getTemplateFirstChild('modal'),
});

const initProductModalView = (pageElement: HTMLElement): ProductView => {
    const modalView = modalViewFactory.makeModalView();
    const productElement = cloneTemplate('card-preview');
    modalView.setContent(productElement);

    const productModalView = makeProductModalView({
        modalView: modalView,
        productView: makeProductView({ productElement }),
    });

    modalView.render(pageElement);

    return productModalView;
};

const pageElement = ensureElement<HTMLElement>('.page');
const productModalView = initProductModalView(pageElement);

const initCartView = (pageElement: HTMLElement) => {
    const cartElement = cloneTemplate('basket');
    console.log('cartElement:', cartElement);
    const cartModal = modalViewFactory.makeModalView();
    cartModal.setContent(cartElement);
    const productsContainer = ensureElement('.basket__list', cartElement);
    cartModal.setContentContainer(productsContainer);

    const cartView = makeCartView({
        cartModal,
        cartButton: makeCartButtonView({
            buttonElement: ensureElement('.header__basket') as HTMLButtonElement,
            totalPriceElement: ensureElement('.header__basket-counter'),
        }),
        cartProductViewFactory: makeCartProductViewFactory({
            prototypeElement: getTemplateFirstChild('card-basket'),
        }),
        cartPriceElement: ensureElement('.basket__price', cartElement),
        createOrderButton: makeButtonView({
            buttonElement: ensureElement('.order-create', cartElement) as HTMLButtonElement,
        }),
    });

    cartModal.render(pageElement);

    return cartView;
};

const cartView = initCartView(pageElement);

const orderDetailModalView = makeFromModalView({
    modalRoot: ensureElement('#order-details-modal'),
    form: Reflect.get(document.forms, 'order-details'),
});

const contactsModalView = makeFromModalView({
    modalRoot: ensureElement('#contacts-modal'),
    form: Reflect.get(document.forms, 'contacts'),
});

const catalogPresenter = makeCatalogPresenter({
    catalog,
    cart,
    catalogView,
    productModalView,
    orderDetailsView,
    contactsModalView,
    cartView,
    ...channels,
});

catalogPresenter.init();
