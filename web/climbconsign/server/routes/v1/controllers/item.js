const DataLink = require('../../../RGPLink/DataLink')()

const extended_json = {
    "name":"",
    "description": {
        "image": "base64 encoded image",
        "brand": "",
        "condition": "",
        "price_lowest": 0,
        "extra": "",
    },
    "seller": {
        "customerid":"",
        "firstname": "",
        "lastname": "",
        "email": "",
        "phone_cell": "",
        "phone_home": "",
        "is_staff": false
    },
    "buyer": {},
    "invoice": {},
    "date_added": Date.now(),
    "date_sold": "",
    "date_payout": "",
    "logs": [
        {
            "datetime": Date.now(),
            "staffid":"",
            "action": "",
            "value_old": "",
            "value_new": ""
        }
    ]
}

/**
 * Sends all of the consignment items
 * @param {*} req 
 * @param {*} response 
 */
exports.get_all = async (req, response) => {
    const master = (await DataLink).master_product_id;
    
    (await DataLink).getConnection()
    .then(conn => {
        const res = conn.query(
            `select * from products where product_type='ICHILD' and parent_product_id=${master} order by inactive ASC`)
        conn.release();
        return res
    }).then(result => {
        // Make sure that everything has the proper extended json
        var r = result[0].map( item => {
            if(item.EXTENDED_JSON.length == 0) {
                item.EXTENDED_JSON = extended_json
            }
            return item
        })
        response.json(r)
    }).catch(err => {
        console.log(err); // any of connection time or query time errors from above
    });
}

exports.post_item = async (req, res) => {
    const master = (await DataLink).master_product_id;
    res.json({requestBody: req.body})
    console.log(req.body)
}

/* API result structure
[
	{
		"NORMAL RGP PRODUCT STUFF" :"",
		"EXTENDED_JSON" : 
	}
]
*/