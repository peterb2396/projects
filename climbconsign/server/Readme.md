## Routes /v1/

### POST /v1/items/
Creates a new consignment item 
Example request body: REQUIRES PIN TO BE SENT AS WELL
```json
{
    "name": "Item 1",
    "price": 100,
    "description": {
        "size_us": 10.5,
        "size_eu": 44.4,
        "size_desc": "Womans small",
        "color_desc": "gray and poopy brown",
        "category": "Shoes",
        "brand": "Evolv",
        "condition": "Used",
        "price_lowest": -1,
        "extra": "Has a really stinky odor on the left"
    },
    "transactions" : {
        "listed": {
            "seller_id": 12345,
            "datetime": ""

        },
        "sold": {
            "buyer_id":-1,
            "datetime":"",
            "invoice_id": -1
        },
        "payout": {
            "staff_id":-1,
            "datetime":"",
            "amount":-1
        }
    },
    "logs": [
        {
            "datetime":"",
            "staff_id":-1,
            "action":"",
            "value_old":"",
            "value_new":""
        }
    ],
    "image":"iVBORw0KGgoAAAANSUhEUgAAAzkAAAKyCAYAAAD2EhC2AAAgAElEQVR4nOzdB5hdR3nw8fesmuV..."
}
```

Example response body:
```json
{
  "product_id": 1234
}
```

### GET /v1/items/
Fetches all consignment products

### GET /v1/items/:product_id
Fetches a specific product by ID

### GET /v1/customers/:customer_id
Fetches a specific customer by ID with the following fields: customer_id, customer_type, firstname, lastname, bday, address1, city, state, zip, home_phone, cell_phone, email, staff_access_level, staff_is_inactive, guid

### POST /v1/auth
send pin as {"pin": "123"}
and receive on customer found (aka auth succesfull) 
```json
{
    "customer_id": 1007,
    "staff_access_level": 10,
    "guid": "10000000-0000-0000-0000-initialstaff"
}
```

TODO: Update items