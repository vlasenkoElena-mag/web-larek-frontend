# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

## Установка и запуск
- src/ — исходные файлы проекта
- common.blocks/ — стили блоков верстки
- scss/ — стили
  - components/ — реализация компонентов
    - base/ — базовый код
    - models/ — модели данных
    - view/ — отображения (не данном этапе не реализованы)
- pages/ — страницы
  - index.html — основная страница и шаблоны компонентов
- types/ — типизация
  - views/ — абстрактные типы представлений
  - api/ — абстрактные типы API
  - index.ts — общие типы
- utils/ — утилиты
- images/ — изображения
- vendor/ — шрифты, иконки и прочее
- api.yaml — спецификация API

## Архитектура проекта

Для ревьювера: По данному заданию наблюдается массовая рассинхронизация между тем что сдают студенты, и тем
что принимают ревьюверы. Уточняю: сдается только 1 ЭТАП работы, предполагающий описание основных типов и архитектуры проекты. На данном этапе не предполагается написание реализации проекта.

В проекте используются базовые типы, определённые в `src/types/index.ts`:

- `ProductId`: уникальный идентификатор товара (`string`).
- `Price`: числовое представление цены (`number`).
- `Payment`: способ оплаты (`string`).
- `Product`: описание товара (id, title, description, image, category, price).
- `OrderDetails`: детали заказа (address, payment).
- `Contacts`: контактные данные покупателя (email, phone).
- `OrderParams`: параметры создания заказа (`OrderDetails` + `Contacts` + `total` и `items`).
- `Order`: созданный заказ (включая `orderId`).
- `OrderId`: уникальный идентификатор заказа (`string`).
- `Observable<Events>`: минимальный интерфейс для подписки на события (`on(event, handler)`).
- `Renderer<T>`: простой рендерер с методом `render(data: T)`.

Архитектура проекта основана на паттерне MVP (Model-View-Presenter). Экземпляры представлений
отвечают за отображение данных пользователю и транслирование событий из UI в собственные события View. Презентер слушает события представлений и обновляет соответствующие модели или другие представления, слушает события моделей и обновляет соответствующие представления.

Используется один презентер - [CatalogPresenter](src/components/presenters/catalog.presenter.ts)
и 2 модели: [CatalogModel](src/components/models/catalog.model.ts), [OrderModel](src/components/models/order.model.ts)

 Модель каталога товаров управляет загрузкой списка товаров, их хранением и выбором конкретного товара. Публикует события, описанные в `EventMap`.
``` typescript
/** Зависимости модели каталога товаров. */
type Deps = {
    /** api для получения данных о товарах */
    productApi: ProductApi;
};

/**
 * Карта событий `CatalogModel`.
 */
type EventMap = {
    /** Публикуется после успешной загрузки списка товаров. */
    ['PRODUCTS:LOADED']: { products: Product[] };
    /** Публикуется при выборе товара пользователем. */
    ['PRODUCT:SELECTED']: { product: Product };
    /** Публикуется при ошибке загрузки списка товаров. */
    ['ERROR:PRODUCTS:LOAD']: LoadProductsError;
};

/**
 * Модель каталога товаров.
 * Управляет загрузкой списка товаров, их хранением и выбором конкретного товара.
 * Публикует события, описанные в `EventMap`.
 */
class CatalogModel extends EventEmitter<EventMap> {
    /**
     * Создаёт экземпляр `CatalogModel`.
     * @param {Deps} deps - Зависимости модели.
     */
    constructor({ productApi }: Deps) {
      //...
    }

    /**
     * Инициализирует модель, запрашивая все товары через `productApi`.
     * - При ошибке публикует событие `'ERROR:PRODUCTS:LOAD'`.
     * - При успешной загрузке сохраняет товары в локальную карту и публикует `'PRODUCTS:LOADED'`.
     *
     * @returns {Promise<void>} Асинхронная операция загрузки.
     */
    public async init(): Promise<void> {
      //...
    }

    /**
     * Возвращает список товаров по переданному массиву идентификаторов.
     *
     * @param {ProductId[]} ids - Массив идентификаторов товаров для получения.
     * @returns {GetProductListResult} Объект с полем `products` при успехе или `error` при ошибке.
     * @throws {ProductNotFoundError} Выбрасывается если один или несколько товаров не найдены.
     */
    public getProducts(ids: ProductId[]): Product[] {
        //...
    }

    /**
     * Публикует событие `'PRODUCT:SELECTED'`.
     *
     * @param {ProductId} id - Идентификатор товара для выбора.
     * @throws {ProductNotFoundError} Выбрасывается если товар с таким id отсутствует.
     */
    public selectProduct(id: ProductId): void {
        //...
    }
}
```
Модель заказа управляет списком товаров в корзине, данными заказа и контактами пользователя. Публикует события, описанные в `EventMap`.
``` typescript
/** Зависимости модели заказа. */
type Deps = {
  /** api для создания заказа */
  orderApi: OrderApi;
};

/**
 * Карта событий `OrderModel`.
 */
type EventMap = {
  /** Публикуется при изменении содержимого корзины. */
  ['CART:UPDATED']: { products: Product[] };
  /** Публикуется после успешного создания заказа. */
  ['ORDER:CREATED']: { order: Order };
  /** Публикуется при ошибке создания заказа. */
  ['ERROR:ORDER:CREATE']: CreateOrderError;
};

/**
 * Модель корзины и создания заказа.
 * Управляет списком товаров в корзине, данными заказа и контактами пользователя.
 * Публикует события, описанные в `EventMap`.
 */
class OrderModel extends EventEmitter<EventMap> {
  /** Добавляет товар в корзину и публикует `'CART:UPDATED'`. */
  public addProduct(product: Product): void {
    //...
  }

  /** Устанавливает детали заказа (адрес, способ оплаты). */
  public setOrderDetails(details: OrderDetails) {
    //...
  }

  /** Устанавливает контактные данные покупателя. */
  public setContacts(contacts: Contacts) {
    //...
  }

  /**
   * Создаёт заказ через `orderApi` на основе текущей корзины, деталей и контактов.
   * Публикует `'ORDER:CREATED'` при успехе или `'ERROR:ORDER:CREATE'` при ошибке.
   */
  public createOrder(): void {
    //...
  }

  /** Удаляет товар из корзины и публикует `'CART:UPDATED'`. */
  public removeProduct(productId: ProductId): void {
    //...
  }

  /** Очищает корзину и публикует `'CART:UPDATED'`. */
  public clearCart(): void {
    //...
  }
}
```

Презентер каталога (`CatalogPresenter`) координирует взаимодействие между `CatalogModel`, `OrderModel` и представлениями.
Основные обязанности:
- инициировать загрузку данных каталога при старте приложения.
- реагировать на события представлений (выбор товара, добавление в корзину) вызовами методов моделей или других представлений;
- реагировать на события моделей вызовами соответствующих методов представлений;

Презентер реализован в файле [CatalogPresenter](src/components/presenters/catalog.presenter.ts).

В методе init описана основная логика взаимодействий.

``` typescript
/**
 * Зависимости `CatalogPresenter`.
 * Модели и представления, с которыми работает презентер.
 */
type Deps = {
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
class CatalogPresenter {
    /**
     * Создаёт экземпляр `CatalogPresenter`.
     * @param deps - Набор зависимостей, необходимых презентеру.
     */
    constructor(deps: Deps) {
      //...
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
            this._contactsView.hide();
        });
    }
}
```

Представления (Views) отвечают за отображение данных и генерацию событий для презентера.
Ниже приведены интерфейсы/контракты основных представлений проекта (находятся в каталоге src/types/views).

``` typescript
/** События представления каталога. */
type CatalogViewEvents = {
    /** публикуется при выборе пользователем товара из каталога */
    ['PRODUCT:SELECTED']: { productId: ProductId };
};

/** Тип представления каталога товаров. */
type CatalogView = Observable<CatalogViewEvents> & Renderer<Product[]>;

/** События модального окна информации о товаре. */
type ProductModalViewEvents = {
    ['BUTTON-CLICK:BUY']: { product: Product };
};

/** Тип представления модального окна товара. */
type ProductView = Observable<ProductModalViewEvents>
  & Renderer<{ product: Product; disableButton: boolean }>;

/** События представления корзины. */
type CartViewEvents = {
    /** публикуется при удалении товара из корзины */
    ['BUTTON-CLICK:REMOVE-PRODUCT']: { productId: ProductId };
    /** публикуется при нажатии кнопки оформления заказа */
    ['BUTTON-CLICK:ORDER-CREATE']: undefined;
};

/** Тип представления корзины. */
type CartView = Observable<CartViewEvents> & Renderer<Product[]> & {
    hide(): void;
};

/** Карта событий формы деталей заказа в модальном окне. */
type OrderDetailsViewEvents = {
    /** публикуется при принятии формы параметров заказа */
    ['FORM-SUBMIT']: OrderDetails;
};

/**
 * Представление модального окна с формой редактирования деталей заказа (`OrderDetails`).
 */
type OrderDetailsView = Omit<FromModalView<OrderDetails>, 'show' | 'modalRoot' | 'form'> & {
    show(orderDetails: OrderDetails): void;
};

/** Представление для редактирования контактных данных (`Contacts`). */
type ContactsView = Omit<FromModalView<Contacts>, 'show' | 'modalRoot' | 'form'> & {
    show(contacts: Contacts): void;
};
```
В проекте используется два минималистичных интерфейса api:
['OrderApi'](src/types/api/order.api.ts) и ['ProductApi'](src/types/api/product.api.ts)
Методы api не пробрасывают исключений, ошибки возвращаются в явном виде в поле результата `error`
```typescript
type CreateOrderResult = { order: Order; error: null }
  | { order: null; error: CreateOrderError };

type OrderApi = {
    /** отправляет запрос на создание заказа */
    create(order: OrderParams): Promise<CreateOrderResult>;
};
```
```typescript
type LoadProductResult = { error: LoadProductsError; products: null }
  | { error: null; products: Product[] };

type ProductApi = {пол
    /** загружает список всех товаров */
    getAll(): Promise<LoadProductResult>;
};

```

## Установка и запуск
```
npm install
npm run start
```
## Сборка

```
npm run build
```
