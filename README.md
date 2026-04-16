# Проектная работа "Веб-ларек"

Интернет-магазин с товарами для веб-разработчиков — Web-ларёк. В нём можно посмотреть каталог товаров, добавить товары в корзину и сделать заказ. 

Стек: HTML, SCSS, TS, Webpack

## Установка и запуск
```
npm install
npm run start
```
## Сборка

```
npm run build
```

## Структура файлов проекта
- src/ — исходные файлы проекта
- common.blocks/ — стили блоков верстки
- components/ — реализация компонентов
    - api/ — запросы к серверу
    - base/ — базовый код
    - models/ — модели данных
    - views/ — отображения
    - presenters —  слой управления приложением
- config — базовый URL
- images/ — изображения
- public/ — статические файлы для прямого включения в сборку (см. `src/public`)
- pages/ — страницы
- scss/ — стили
  - index.html — основная страница и шаблоны компонентов
- types/ — типизация
  - views/ — абстрактные типы представлений
  - api/ — абстрактные типы API
  - model — абстрактные типы модели
  - index.ts — общие типы
- utils/ — утилиты
- vendor/ — шрифты, иконки и прочее

## Архитектура проекта

В проекте используются базовые типы, определённые в `src/types/index.ts`:

/**
 * Параметры заказа, используемые при создании заказа.
 * Объединяет детали заказа, контакты и служебные поля `total` и `items`.
 */
type OrderParams = OrderDetails & Contacts & OrderItems;

type CustomerInfo = Contacts & OrderDetails;;

/**
 * Базовый интерфейс наблюдаемых ресурсов (например различные экземпляры View и Model)
 * для типизации публикуемых событий.
 */
type Observable<Events extends Record<string, unknown>> = {
    on<E extends keyof Events>(event: E, handler: (payload: Events[E]) => void): void;
};

/** Базовый интерфейс представлений отображающих данные. */
type Renderer<T> = {
    render(data: T): void;
};

В проекте используется класс [ObservableObject](src/components/base/observable-object.ts). Реализующий интерфейс `Observable`.
Данный класс является обёрткой над `EventEmitter`, скрывающей все методы, кроме метода подписки (`on`) от клиентов класса; метод `_emit` (публикация событий) является `protected` и доступен только наследникам `ObservableObject`.
Классы представлений, публикующие собственные события, наследуют от `ObservableObject`.
Наследники `ObservableObject` (View) реализуют шаблон наблюдатель, где издателем являются представления, публикующие собственные события, а подписчиком — презентер, обрабатывающий эти события.

Архитектура проекта основана на паттерне MVP (Model-View-Presenter).

### Описание паттерна MVP, основных его элементов и их обязанностей и особенностей реализации в проекте 

Шаблон проектирования MVP (Model-View-Presenter) 
**Общее назначение**
MVP — архитектурный шаблон, который разделяет приложение на три основных слоя для улучшения модульности, тестируемости.

1. Model (Модель)
Назначение: Слой данных и бизнес-логики
Задачи: Инкапсуляция логики работы с данными (получение, хранение, обработка), работа с источниками данных (например API)
Оповещение об изменениях данных (в данном проекте через механизм публикации событий).

2. View (Представление)
Назначение: Отображение данных и взаимодействие с пользователем
Задачи: Визуализация данныхб, обработка пользовательских (браузерных) событий

3. Presenter (Посредник)
Назначение: посредник между Model и View
Задачи: Обработка пользовательских действий от View (через механизм назначения обработчиков), вызов соответствующих методов Model,
управляет представлениями (например вызывает соответствующие методы отрисовки данных при получении событий от модели), 

Особенности реализации шаблона в данном проекте:
Существует два основных подхода к назначению обработчиков событий (например для представлений)
 - передача их через конструктор, пример:
```typescript
const handleButtonClick = (product: Product) => {...};

new SomeView ({
  onBuyButtonClick: handleButtonClick
  ...
});
```
 - назначение через специальный метод, пример:
```typescript
init() { // Presenter
  const handleButtonClick = (productId: Product) => {...};
  this.someView.on('CLiCK:BUY-BUTTON', handleButtonClick);
}
```
При правильной типизации, оба подхода обеспечиват типобезопасность кода.
В проекте используется второй подход. Обоснование выбора второго варианта:
При использовании первого варианта, экземпляры предствалений создаются внутри презентера, пример
```typescript
constructor(...) { // Presernter
  this.#someView = new SomeView({
    onBuyButtonClick: product => this.model.addProduct(product)
    ...
  });
}
```
это создает проблемную транзитивную зависимость презентера от браузерных реализаций представлений `presenter -> view -> браузерные обьекты` 
при использовании второго подхода, данная проблемная зависимость может быть инвертирована (презентер зависит только от интерфейса представлений, но не от браузер-зависимых реализаций), пример:
```typescript
// presenter.ts
class Presenter {
  constructor({}: { someView: SomeViewInterface }) { // Presenter зависит только от интрефейса
  this.someView = someView();
  ...
  this.init();
  }
}
// index.ts
const someView = new SomeView({
  someDomElement: ensureElement('some-element-selector',)
});
const presenter = new Presenter({ someView });
```
Устранение проблемной зависимости позволяет легко тестировать логику презентера внедряя тестовые дублеры представлений. Кроме того, 
это позволяет компактно и очень лаконично описывать логику назначения обработчиков а методе init презентера, что облегчает понимание кода.
Данный проект почти не требует динамического создания DOM елементов (исключение - карточки товара каталога), поэтому большинство представлений будут просто запрашивать элементы дом из документа document/main-element в конструкторе (или принимать в параметрах конструктора).
В качестве иллюстрации можно посмотреть код CatalogPresenter из данного проекта с пояснениями:
[CatalogPresenter](src/components/presenters/catalog.presenter.ts)


Пример потока данных:
```
User clicks "Купить" button
    ↓
Представление модального окна продукта публикует событие 'BUTTON-CLICK:BUY' c данными `{ productId: string }`
    ↓
Презентер (CatalogPresenter) слушает событие 'BUTTON-CLICK:BUY' и вызывает метод модели корзины addProduct(product);
    ↓
После успешного добавления товара в корзину презентер вызывает метод представления `setAddToCartButtonState`
    ↓
Кнопка "Купить" деактивируется
```

Во избежание путаницы отмечу, что не следует путать браузерные события (например button 'click') и события представлений (например 'BUTTON-CLICK:BUY').

### Список событий приложения
- `CatalogModel` — `PRODUCTS:LOADED` : `{ products: Product[] }`
- `CatalogView` — `PRODUCT:SELECTED` : `{ productId: ProductId }`
- `ProductModalView` — `BUTTON-CLICK:BUY` : `{ productId: string }`
- `CartModel` — `CART:UPDATED` : `{ products: Product[] }`
- `CartView` — `BUTTON-CLICK:REMOVE-PRODUCT` : `{ productId: ProductId }`
- `CartView` — `BUTTON-CLICK:ORDER-CREATE` : `undefined`
- `HeaderView` — `BASKET:OPEN` : `null`
- `OrderDetailsView` — `FORM-SUBMIT` : `OrderDetails`
- `ContactsView` — `FORM-SUBMIT` : `Contacts`
- `OrderCreationResultView` — `ORDER-CREATION-RESULT:CLOSED` : `undefined`
- `ModalView` — `MODAL:CLOSED` : `undefined` (emitted by modal implementations)
- `CustomerModel` — `CUSTOMER:CHANGED` : `{ customerInfo: CustomerInfo }`
- `OrderDetailsView` — `FORM-CHANGED` : `Partial<OrderDetails>` (view publishes form changes)
- `ContactsView` — `FORM-CHANGED` : `Partial<Contacts>` (view publishes form changes)



### Краткое описание архитектуры проекта:
Используется один презентер: 
- [CatalogPresenter](src/components/presenters/catalog.presenter.ts)
и 3 модели: 
- [CartModel](src/components/models/cart.model.ts), - содержит данные и логику  относящиеся к карзине товаров
- [CatalogModel](src/components/models/catalog.model.ts) - содержит данные и логику продуктам
- [CustomerModel](src/components/models/customer.model.ts) - содержит данные и логику пользовательских данных

Пример реализации представления и его частей:
- [ProductModalBrowserView](src/components/views/product/product-modal.view.ts) - корневое представление
- [ProductCardBrowserView](src/components/views/product/product-card.view) -  вложенное представление карточки товара
- [ModalBrowserView](src/components/views/common/modal.view.ts) - базовое представление модального окна

это комплексное представление, содержащее другие представление и довольно много логики взаимодействия с DOM, но вся эта логика скрыта за очень простым  [интерфейсом](src/types/views/product.view.ts) включающим всего три метода: 
  - on(подписаться на собыия),
  - render(показать данные продукта).
  - setAddToCartButtonState(disabled: boolean) - установить состояние кнопки "Купить"
Данное представление публикует всего одно событие `BUTTON-CLICK:BUY` c данными `{ productId: string }`. 
Динамический рендеринг DOM елементов не используется.

Презентер каталога (`CatalogPresenter`) координирует взаимодействие между моделями и представлениями.
Основные обязанности:
- реагировать на события представлений (выбор товара, добавление в корзину) вызовами методов моделей или других представлений;
- вызывать соответствующие методы представлений при изменении моделей;


Метод init в классе CatalogPresenter отвечает за настройку всех основных взаимодействий между моделями (CatalogModel и OrderModel) и представлениями (views) в приложении. 

Логика построена вокруг следующих ключевых потоков:

Выбор и просмотр товара.
Управление корзиной (добавление/удаление товаров).
Процесс оформления заказа (детали заказа → контакты → создание заказа).
Ниже приведено пошаговое описание каждой подписки на события в методе init. Каждая подписка описана с указанием:

Кто слушает (источник события).
Какое событие (триггер).
 `ProductModalView` — `BUTTON-CLICK:BUY` : `{ productId: string }`
Действие: Получается товар по его ID из модели каталога, рендерит данные товара через productView и устанавливает состояние кнопки покупки в зависимости от того, есть ли товар в корзине.

Событие: 'BUTTON-CLICK:BUY' публикуется представлением товара при клике на кнопку покупки.
Действие: Товар добавляется в cartModel; представление корзины рендерит обновлённый список товаров (число товаров в карзине в свернутом состоянии, список товаров в развернутом); кнопка покупки в представлении товара блокируется.

Событие: 'BUTTON-CLICK:REMOVE-PRODUCT' публикуется представлением корзины при клике на кнопку удаления товара.
Действие: Товар удаляется из cartModel; представление корзины рендерит актуальный список товаров;

Событие: 'BUTTON-CLICK:ORDER-CREATE' публикуется представлением корзины при клике на кнопку "оформить заказ".
Действие: Отображается форма ввода адреса и способа оплаты с текущими данными из модели покупателя(CustomerModel) (по умполчанию пустыми).

Событие: 'FORM-SUBMIT' публикуется представлением деталей заказа при сабмите формы.
Действие: адрес и способ оплаты сохраняются в customerModel; 
Пример потока данных:
```
User clicks "Купить" button
  ↓
Представление модального окна продукта публикует событие 'BUTTON-CLICK:BUY' c данными `{ productId: string }`
  ↓
Презентер (CatalogPresenter) слушает событие 'BUTTON-CLICK:BUY', получает полную информацию о товаре из `CatalogModel` по `productId`, затем вызывает метод модели корзины `addProduct(product)`;
  ↓
После успешного добавления товара в корзину презентер вызывает метод представления `setAddToCartButtonState`
  ↓
Кнопка "Купить" деактивируется
```
открывается форма контактов и рендерится с текущими контактными данными из модели покупателя.

Событие: 'FORM-SUBMIT' публикуется представлением контактов при сабмите формы.
Действие: Контактные данные сохраняются в модели покупателя; презентер инициирует создание заказа — вызывает orderApi.create с валидными позициями корзины (cartModel.getValidItems()) и валидной информацией покупателя (customerModel.getCustomerInfo()); при успешном создании представление результата рендерит итоговую сумму заказа в представление результата.

Эта логика обеспечивает полный цикл основного сценария взаимодействия пользователя с приложением: от просмотра каталога до завершения заказа. Все изменения состояния (в моделях) автоматически отражаются в представлениях, а действия пользователя (в представлениях) обновляют модели.

Представления (Views) отвечают за отображение данных и генерацию событий для презентера.
[интерфейсы/контракты основных представлений проекта](src/types/views).


В проекте используется два минималистичных интерфейса api:
- ['OrderApi'](src/types/api/order.api.ts)
- ['ProductApi'](src/types/api/product.api.ts)

Методы api не пробрасывают исключения, ошибки возвращаются в явном виде в поле результата `error`.

### API: Endpoints and responses

Краткая сводка эндпойнтов и форматов ответов, используемых в приложении:

- GET /product
  - Ответ: `{ total: number, items: Product[] }`
  - Используется в `ProductApi.getAll()` и затем в `CatalogModel.loadProducts()`.

- POST /order
  - Тело запроса: `OrderParams` (объединение `OrderDetails`, `Contacts`, `OrderItems`)
  - Ответ: `OrderCreationResponse` (`{ id: string, total: number }`) или ошибка.

Примеры типов (см. `src/types/`): `Product`, `OrderParams`, `OrderCreationResponse`.

> Примечание: API-слой (`ProductApi`, `OrderApi`) возвращает объект вида `{ error, ... }`. Это даёт возможность обрабатывать ошибки без проброса исключений.

### Public view methods (signatures)

Ниже — короткая таблица основных представлений и их публичных методов/сигнатур.

- `CatalogView`
  - `render(products: Product[]): void`
  - `on(event: 'PRODUCT:SELECTED', handler: ({ productId: string }) => void): void`

- `ProductModalView` (корневое модальное представление товара)
  - `render(product: Product): void`
  - `on(event: 'BUTTON-CLICK:BUY', handler: ({ productId: string }) => void): void`
  - `setAddToCartButtonState(disabled: boolean): void`

- `CartView`
  - `render(products: Product[]): void`
  - `on(event: 'BUTTON-CLICK:REMOVE-PRODUCT', handler: ({ productId: string }) => void): void`
  - `on(event: 'BUTTON-CLICK:ORDER-CREATE', handler: () => void): void`

- `OrderDetailsView`
  - `render(details: OrderDetails): void`
  - `on(event: 'FORM-SUBMIT', handler: (details: OrderDetails) => void): void`
  - `enableSubmitButton(): void`
  - `disableSubmitButton(): void`

- `ContactsView`
  - `render(contacts: Contacts): void`
  - `on(event: 'FORM-SUBMIT', handler: (contacts: Contacts) => void): void`
  - `disableSubmitButton(): void`
  - `enableSubmitButton(): void`
  - `renderErrors(errors: string[] | Partial<Record<keyof Contacts, string>>): void`
  - `resetErrors(): void`
  - `hide(): void`

- `OrderCreationResultView`
  - `render(total: number): void`

- `ModalBrowserView` (базовое модальное)
  - `show(): void`, `hide(): void`

Эти сигнатуры соответствуют интерфейсам в `src/types/views` и реализациям в `src/components/views`.

### Подробные описания типов представлений

Класс CatalogView  
Задача: Отображает список товаров в каталоге и позволяет пользователю выбрать товар для просмотра.  
События:'PRODUCT:SELECTED', данные события `{ productId: ProductId }`;
Методы:  
  render - рендерит список товаров;  
  on - подписка на события

Класс ProductModalView  
Задача: Отображает информацию о выбранном товаре в модальном окне и позволяет добавить товар в корзину.
События: 'BUTTON-CLICK:BUY', данные события `{ productId: string }`;  
Методы:  
  render - рендерит товар с состоянием кнопки покупки;
  on - подписка на событие нажатия кнопки "купить".
  setAddToCartButtonState(disabled: boolean) - устанавливает состояние кнопки "Купить"

Класс CartView  
Задача: Отображает список товаров в корзине, позволяет удалять товары и начинать процесс оформления заказа. 
События: 
  'BUTTON-CLICK:REMOVE-PRODUCT', данные события `{ productId: ProductId }`;  
  'BUTTON-CLICK:ORDER-CREATE', без данных;
Методы:  
  render - рендерит список товаров в корзине;
  on - подписка на события удаления товара или начала оформления заказа.

Класс OrderDetailsView  
Задача: Отображает модальное окно с формой для ввода деталей заказа (адрес, способ оплаты).  
События: 'FORM-SUBMIT', данные события `OrderDetails`;
Методы:  
  render - рендерит форму деталей заказа;  
  on - подписка на событие отправки формы.
  enableSubmitButton() - включает кнопку отправки формы
  disableSubmitButton() - отключает кнопку отправки формы

Класс ContactsView  
Задача: Отображает модальное окно с формой для ввода контактных данных пользователя.  
События: 'FORM-SUBMIT', данные события `{email: string, phone: string}`;
Методы:  
  render - показывает модальное окно с текущими контактными данными;
  disableSubmitButton() - отключает кнопку отправки формы;
  enableSubmitButton() - включает кнопку отправки формы;
  renderErrors(errors: string[]) - отображает ошибки в форме;
  resetErrors() - сбрасывает отображаемые ошибки;
  hide - закрывает окно с контактными данными;  
