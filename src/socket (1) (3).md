## Create order

`wss://globus-nukus.uz/ws/orders?token={{token}}`

Token joqaridagiday parameter etilip jiberiliwi kerek 

```
PAYMENT_TYPES = [
        (1, "Картой онлайн"),
        (2, "Наличными или картой при получении"),
    ]
    DELIVERY_TYPES = [
        (1, "Самовывоз"),
        (2, "Курьерская доставка"),
    ]
```

Request example
```
{
    "type": "create_order",
    "message": {
        "amount": 42000,  /* Zakazdin obshiy summasi Обязательное поле. */
        "payment_type": 2,  /* Обязательное поле. */
        "delivery_type": 1, /* Обязательное поле. */
        "use_cashback": false,
        "receiver":{
            "first_name": "Something", /* Обязательное поле. */
            "last_name": "Surname", /* Обязательное поле. */
            "phone": "998991234567", /* Usinday formatta boliwi kerek Обязательное поле. */
            // "address": "Street A 15" /* Eger Самовывоз bolsa shart emes. необязательное поле. */
            "longitude": 25.552,
            "latitude": 54.548
        },
        "items":[
            {
                "product": 8,
                "price": 42000,
                "quantity": 1
            }
            // ,{
            //     "product": 2,
            //     "price": 20000,
            //     "quantity": 2
            // }
        ]
    }
}
```



## Get orders
`wss://globus-nukus/ws/orders?token={{token}}`

Token joqaridagiday parameter etilip jiberiliwi kerek.
Userdin barliq zakazlarin aliw
Qilingan oplatalarda usi jerden qaytadi. 

### Request example
```
{
    "type": "get_orders"
}
```

### Response example
```
[{
    "id": 20,
    "order_number": "79463378",
    "amount": 35480.0,    (total_amount-cashback_used) 
    "total_amount": 42000.0,
    "use_cashback": true,
    "cashback_earned": 840.0,  usi zakazdan tusken cashback
    "cashback_used": 6520.0,  usi zakazga paydalanilgan cashback
    "status": "Ожидает подтверждения",
    "payment_type": 2,
    "delivery_type": 2,
    "receiver": {
        "id": 20,
        "first_name": "Something",
        "last_name": "Surname",
        "phone": "998991234567",
        "address": null,
        "longitude": 25.552,
        "latitude": 54.548
    },
    "items": [
        {
            "price": 42000,
            "quantity": 1,
            "product": 8,
            "product_name": "Бумага листовая для офисной	",
            "total_price": 42000
        }
    ],
    "cash_payments": [  при получение tolengen oplatalar
        {
            "amount": 500.0,
            "type": "Наличные",
            "created_at": "2024-06-10T19:36:24.711761+05:00"
        }
    ],
    "online_payments": [  online paymedan tolengen oplatalar
        {
            "amount": 500.0,
            "qr_code_url": "https://ofd.soliq.uz/epi?t=EP000000000356&r=414622483&c=20240610160048&s=168355950146"
            "perform_time": "2024-06-10T11:00:48+05:00"
        }
    ],
    "created_at": "2024-06-07T17:22:07.174532+05:00",
    "status_updated": "2024-06-07T17:22:07.172214+05:00"
}
]
`````````````


Создать заказ (WebSocket) ──────────────────────────────────────── Подключитесь один раз:

wss://globus-nukus.uz/ws/orders?token=<access-token>
Отправьте сообщение:

json
{
  "type": "create_order",
  "message": {
    "amount": <total_amount>,        // сумма корзины + доставка
    "payment_type": 1 | 2,           // 1 = онлайн, 2 = наличные / карта при получении
    "delivery_type": 1 | 2,          // 1 = самовывоз, 2 = курьер
    "use_cashback": false,
    "receiver": {
      "first_name": "...",
      "last_name": "...",
      "phone": "...",
      "longitude": 54.548,           // null при самовывозе
      "latitude": 25.552
    },
    "items": [
      { "product": <id>, "price": <num>, "quantity": <num> }
    ]
  }
}
Ответ сервера:

json
{
  "type": "order_created",
  "data": {
    "id": <order_id>,
    "order_number": "№0000123"
  }
}
Сохраняем <order_id>.

──────────────────────────────────────── 4. (Только для ONLINE-оплаты) Создать счёт ──────────────────────────────────────── • POST /receipts/receipts_create

json
{
  "amount": <total_amount>,
  "order_id": <order_id>
}
→ _id счёта = <invoice_id>.

──────────────────────────────────────── 5. (Только ONLINE) Привязать и подтвердить карту ──────────────────────────────────────── A. Получить токен карты
• POST /cards/create_card

json
   { "card_number": "8600…", "expire_date": "MM/YY" }
→ "token": "<card_token>"

B. Запросить SMS-код
• POST /cards/get_verify_code

json
   { "token": "<card_token>" }
C. Подтвердить карту
• POST /cards/verify_card

json
   { "token": "<card_token>", "code": "<6-значный код>" }
(Проверить статус при необходимости: POST /cards/check_card)

──────────────────────────────────────── 6. (Только ONLINE) Оплатить счёт ──────────────────────────────────────── • POST /receipts/receipts_pay

json
{
  "token": "<card_token>",
  "invoice_id": "<invoice_id>"
}
Успех ⇒ заказ оплачен; очищаем корзину.

──────────────────────────────────────── 7. Путь «Наличными / картой при получении» ──────────────────────────────────────── Пропускаем шаги 4-6.
Сразу после order_created показываем подтверждение и при желании чистим корзину.

──────────────────────────────────────── Итого — порядок действий ────────────────────────────────────────


WebSocket create_order → order_created
Если онлайн-оплата:
a. POST /receipts/receipts_create
b. POST /cards/create_card
c. POST /cards/get_verify_code
d. POST /cards/verify_card
e. POST /receipts/receipts_pay
DELETE /cart/delete-all
Готово — статус заказа можно смотреть по тому же WebSocket .../ws/orders?token=...