const DataLink = require('./DataLink')
const RGPLink = require('./RGPLink')


let master_product_id = null

// Format for the extended_json object that we'll use to store the extra information we need
const extended_json = {
    name: "Item 1",
    description: {
        size_us: "",
        size_eu: "",
        size_desc: "",
        color_desc: "",
        category: "",
        brand: "",
        condition: "",
        price_lowest: -1,
        extra: ""
    },
    transactions : {
        "listed": {
            "seller_id": -1,
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
    ],
    "image":""
}


exports.UpdateProduct = async (product) => {
    return new Promise(async (resolve, reject) => {
        let conn = null;
        try {
            conn = await DataLink.pool.getConnection()
            const query = `UPDATE products
                        SET 
                            BARCODE=?, 
                            DISP_CATEGORY=?, 
                            DESCRIPTION=?, 
                            RETAIL_PRICE=?, 
                            WANT_INFO=?, 
                            INACTIVE=?, 
                            WANT_MEMBERS=?, 
                            QUANTITY_LOCKED_TO_ONE=?, 
                            EXCLUDE_GUESTS=?, 
                            WANT_INFO_LABEL=?, 
                            TAX_TYPE_LIST=?, 
                            PARENT_PRODUCT_ID=?, 
                            SUBITEMS_SAME_PRICE=?, 
                            REVENUE_SUBCATEGORY=?, 
                            VENDOR_ID=?, 
                            REV_CATEGORY=?, 
                            REVCAT_SAMEAS_DISPCAT=?, 
                            PRODUCT_TYPE=?, 
                            GROUP_ID=?, 
                            SIZE_DESC=?, 
                            COLOR_DESC=?, 
                            REORDER_POINT=?, 
                            REORDER_QUANTITY=?, 
                            EXCLUDE_FROM_AUTODISCOUNTS=?, 
                            GUID=?, 
                            DO_NOT_SYNC_PRICE=?, 
                            IMPORT_TAG=?, 
                            REORDER_MAX=?, 
                            POS_ACTION=?, 
                            PACKAGED_PRODUCTS_JSON=?, 
                            NOTES_JSON=?, 
                            PREPARED_INTERNAL_NOTE=?, 
                            MERGE_TARGET_NAME=?, 
                            MERGE_TARGET_GUID=?, 
                            EXTENDED_JSON=?
                        WHERE PRODUCT_ID=?;`
            await conn.query(query, [
                product.BARCODE
                ,product.DISP_CATEGORY
                ,product.DESCRIPTION
                ,product.RETAIL_PRICE
                ,product.WANT_INFO
                ,product.INACTIVE
                ,product.WANT_MEMBERS
                ,product.QUANTITY_LOCKED_TO_ONE
                ,product.EXCLUDE_GUESTS
                ,product.WANT_INFO_LABEL
                ,product.TAX_TYPE_LIST
                ,product.PARENT_PRODUCT_ID
                ,product.SUBITEMS_SAME_PRICE
                ,product.REVENUE_SUBCATEGORY
                ,product.VENDOR_ID
                ,product.REV_CATEGORY
                ,product.REVCAT_SAMEAS_DISPCAT
                ,product.PRODUCT_TYPE
                ,product.GROUP_ID
                ,product.SIZE_DESC
                ,product.COLOR_DESC
                ,product.REORDER_POINT
                ,product.REORDER_QUANTITY
                ,product.EXCLUDE_FROM_AUTODISCOUNTS
                ,product.GUID
                ,product.DO_NOT_SYNC_PRICE
                ,product.IMPORT_TAG
                ,product.REORDER_MAX
                ,product.POS_ACTION
                ,product.PACKAGED_PRODUCTS_JSON
                ,product.NOTES_JSON
                ,product.PREPARED_INTERNAL_NOTE
                ,product.MERGE_TARGET_NAME
                ,product.MERGE_TARGET_GUID
                ,JSON.stringify(product.EXTENDED_JSON)
                ,product.PRODUCT_ID
            ])
        } catch (err) {
            console.log(err)
            reject(err)
        } finally {
            if(conn) conn.release()
            resolve(product)
        }
    })
}

/**
 * Fetches a specific product by ID
 * @param {} product_id 
 * @returns 
 */
exports.GetProductByID = async (product_id) => {
    return new Promise(async (resolve, reject) =>{
        let conn = null
        try {
            // Create connection
            conn = await DataLink.pool.getConnection()
            // Query the DB
            const [rows, meta] = await conn.query('select * from products where product_id=?', [product_id])

            // Objectify the extended_json 
            var objectified = rows.map( item => {
                // Parse the EXTENDED_JSON and set it as an object
                item.EXTENDED_JSON = JSON.parse(item.EXTENDED_JSON)
                return item
            })

            // Resolve the objectified
            resolve(objectified)

        } catch (err) {
            throw err
        } finally {
            // Release the connection
            if(conn) conn.release()
        }
    })
}

/**
 * Fetches a single customer by ID
 * @param {} customer_id 
 * @returns 
 */
exports.GetCustomerByID = async (customer_id) => {
    return new Promise(async (resolve, reject) => {
        let desired_fields = 'customer_id, customer_type, firstname, lastname, bday, address1, city, state, zip, home_phone, cell_phone, email, staff_access_level, staff_is_inactive, guid'
        let conn = null
        try{
            // Create a connection
            conn = await DataLink.pool.getConnection()
            // Query it for the selected customer
            const [rows, header] = await conn.query(`select ${desired_fields} from customers where customer_id=? limit 1`, [customer_id])
            resolve(rows)
        } catch (err) {
            console.log(err.stack)
            resolve(err)
        } finally {
            if(conn) conn.release()
        }
    })
}

/**
 * Fetches all customers
 * @returns 
 */
exports.GetAllCustomers = async () => {
    return new Promise(async (resolve, reject) => {
        let desired_fields = 'customer_id, customer_type, firstname, lastname, bday, address1, city, state, zip, home_phone, cell_phone, email, staff_access_level, staff_is_inactive, guid'
        let conn = null
        try{
            // Create a connection
            conn = await DataLink.pool.getConnection()
            // Query it for the selected customer
            const [rows, header] = await conn.query(`select ${desired_fields} from customers`)
            resolve(rows)
        } catch (err) {
            console.log(err.stack)
            resolve(err)
        } finally {
            if(conn) conn.release()
        }
    })
}

/**
 * Convert a search input into a sql valid filter with the required parameters
 * @param {string} input Input string in one of the following forms: 'lastname', 'lastname firstname', 'lastname, fistname'
 * @returns 
 */
const GenerateFilter = (input) => {
    let filter = "";
    let params = []

    if (input.split(',').length > 1)
    {
        filter = `Lastname like ? and Firstname like ?`
        params = [`${input.split(',')[0]}%`, `${input.split(',')[1].trim()}%`]
    }
    else if (input.split(' ').length > 1)
    {
        filter = `Lastname like ? and Firstname like ?`
        params = [`${input.split(' ')[0]}%`, `${input.split(' ')[1].trim()}%`];
    }
    else
    {
        filter = `Lastname like ?`
        params = [`${input}%`];
    }
    
    return [filter, params]
}

// FIXME maybe limit what we're selecting in the future, or have a safe search that only gives id, name, etc
/**
 * Fetches at most 50 customers that match a search string
 * @param {string} input search string
 * @returns 
 */
exports.FindCustomer = async (input) => {
    return new Promise(async (resolve, reject) => {
        let conn = null 
        try {
            // Fetch a new connection
            conn = await DataLink.pool.getConnection()

            // Generate a filter and sql parameters
            const [filter, params] = GenerateFilter(input)

            // Select a customer who matches the filter, and limit it to 50
            const query = `select * from customers where ${filter} limit 50`

            // Fetch the result
            const [rows] = await conn.query(query, params)

            // Return the result
            resolve(rows)
        } catch(err) {
            reject(err)            
        } finally {
            if(conn) await conn.release()
        }
    })
}

/**
 * 
 * @param {*} fields Expected Fields when creating a new object:
 * name, brand, condition, price_lowest, extra, seller.customer_id
 * @returns 
 */
exports.InsertProduct = async(fields) => {
    let conn = null
    try {
        //console.log('inserting: ', fields)
        // Should return the new product id 
        // Create a copy of extended_json 

        // Fetch a fresh GUID
        const guid = await RGPLink.GenerateGUID()

        // Fetch the tax id from the configured tax code
        const tax = (await RGPLink.GetTaxByCode(process.env.TAX_CODE))
        const tax_id = tax.TAXTYPE_ID

        // Fetch the master product ID
        const master = await MasterProductID()

        // store the uploaded image

        const json_meta = JSON.stringify(fields);
        const query = `insert into products(
                product_id, 
                barcode, 
                QUANTITY_LOCKED_TO_ONE,
                EXCLUDE_GUESTS,
                WANT_INFO_LABEL,
                TAX_TYPE_LIST,
                VENDOR_ID,
                REV_CATEGORY,
                REVCAT_SAMEAS_DISPCAT,
                PACKAGED_PRODUCTS_JSON,
                NOTES_JSON,
                PREPARED_INTERNAL_NOTE,
                disp_category, 
                description, 
                retail_price, 
                want_info, 
                inactive, 
                want_members, 
                parent_product_id, 
                product_type, 
                group_id, 
                size_desc, 
                color_desc, 
                guid, 
                extended_json
            ) 
            values(?, ?, 0, 1, 0, ?, 1004, 'Retail', 1, '', '', '', 'Retail', ?, ?, 0, 0, 1, ?, 'ICHILD', ?, ?, ?, ?, ?);`;
            
        conn = await DataLink.pool.getConnection()
        // Inser the object
        const [meta] = await conn.query(query,  [guid.id, guid.id, tax_id, fields.name, fields.price, master, master, fields.description.size_desc, fields.description.color_desc, guid.guid, json_meta])
        // Fetch that object and return it
        const [[product]] = await conn.query("select * from products where product_id=?", [guid.id])
        return product
    } catch (err) {
        console.error(err)
    } finally {
        if(conn) conn.release()
    }
}

/** Do filtering on the frontend or the backend? IDK */
exports.AllProductsFromSeller = async (customer_id) => {
    const products = await this.AllProducts();
    const res = products.filter((item) => {
        return item.EXTENDED_JSON.transactions.listed.seller_id == customer_id
    })
    return res;
}

exports.AllProducts = async () => {
    return new Promise(async (resolve, reject) => {
        // Fetch the master product id
        const master = await MasterProductID()

        let conn = null
        try{
            conn = await DataLink.pool.getConnection()
            const [rows, meta] = await conn.query(`select * from products where product_type='ICHILD' and parent_product_id=? order by inactive ASC`,
                [master])
            // Convert the extended_json to an object
            var objectified = rows.map(product => {
                product.EXTENDED_JSON = JSON.parse(product.EXTENDED_JSON)
                return product
            })
            resolve(objectified)
        } catch(err) {
            reject(err);
        } finally {
            if(conn) conn.release()
        }
    })
}

//delete by id
exports.DeleteProduct = async (data) => {
    return new Promise(async (resolve, reject) => {
        let conn = null
        try{
            conn = await DataLink.pool.getConnection()
            await conn.query(`DELETE FROM products WHERE product_id = ${data['id']};`)

            resolve()
        } catch(err) {
            reject(err);
        } finally {
            if(conn) conn.release()
        }
    })
}



/**
 * Fetch the master product ID
 * @param {*} pool 
 * @returns 
 */
async function MasterProductID() {
    if(!master_product_id) {
        try {
            const query = 'select * from products where lower(description) like \'consignment\' and product_type=\'IPARENT\' limit 1';
            const [res, meta] = await DataLink.pool.execute(query)
            const id = res[0].PRODUCT_ID
            if(!id) throw new Error("No consignment product created yet. Please create a new product group called 'Consignment' in RGP's Data Entry -> Products window")
            else
                master_product_id = id
        } catch (err) {
            console.log("Error in ConsignLink MasterProductID()")
            throw err
        }
    } 
    return master_product_id
}
module.exports.MasterProductID = MasterProductID

/**
 * Return updated information about the stuff
 * @param {Product} product 
 */
const UpdateProductTransactions = async (product) => {

    let transactions = product.EXTENDED_JSON.transactions
    // Get all the invoices for the product
    const invoices = await RGPLink.InvoiceForProduct(product)
    
    if(invoices.length == 0) { // If there aren't any invoices, don't change anything, just return the transactions
        console.log("No transactions found for item")
        return transactions
    }

    // Fetch the desired information from the first invoices obejt
    const [{CHARGETO_CUSTOMER_ID, POSTDATE, INVOICE_ID, EXPLOYEE_ID}] = invoices
    // Populate the transactions with updated information
    transactions.sold.buyer_id = CHARGETO_CUSTOMER_ID
    transactions.sold.datetime = POSTDATE
    transactions.sold.invoice_id = INVOICE_ID

    // Save the product
    product.EXTENDED_JSON.transactions = transactions
    product.INACTIVE = true

    //console.log(product)
    await this.UpdateProduct(product)
}
module.exports.UpdateProductTransactions = UpdateProductTransactions