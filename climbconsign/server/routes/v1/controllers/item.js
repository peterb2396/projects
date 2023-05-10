const ConsignLink = require('../../../RGPLink/ConsignLink')
const LabelPrinter = require('../../../integrations/LabelPrinter')
const { diff, addedDiff, deletedDiff, updatedDiff, detailedDiff } = require('deep-object-diff')

const fs = require('fs')
const host = "http://localhost:1337"

// Delete the given image by web path
function deleteByURL(url)
{
    let path = process.cwd() + "/public" +url.substring( url.indexOf("/images/"))
  // do not allow if url is blank because were trying to delete the entire image folder!!
  if (url == "" || url == "default-img.jpg")
    return;


  // finds the image given by the url on the local machine (server) and tries to delete it
  fs.unlink(path, (err) => {
    if (err) {
        console.log(err) // we couldnt delete the image from the server, but we should continue to delete item from DB.
    }
    // We successfully deleted the old file.
});
}


exports.print_label = async (req, res) => {
    // grab the product ID 
    const product_id = req.params['product_id']
    // Fetch a product from that product ID
    const [product] = await ConsignLink.GetProductByID(product_id)
    // Fetch the seller from that product
    
    let transactions = JSON.parse(product.EXTENDED_JSON.transactions)
    const [seller] = await ConsignLink.GetCustomerByID(transactions['listed']['seller_id'])

    // FIXME Do error checking and response
    // Print the label with the pertinent information
    LabelPrinter.print(product_id, product.EXTENDED_JSON.name, product.size_desc, product.color_desc, seller.lastname, seller.firstname)

    console.log(`POST:: Printing label for product ${product_id}`)
    res.json({success: true})
}

exports.get_item = async (req, res) => {
    const {product_id} = req.params
    const items = await ConsignLink.GetProductByID(product_id)
    
    if(items.length == 0)
        return res.status(404).json(items)

    console.log(`GET:: Fetching product  ${product_id}`)
    res.json(items)
}

exports.get_all_from_seller = async (req, res) => {
    const {customer_id} = req.params
    const items = await ConsignLink.AllProductsFromSeller(customer_id)
    
    if(items.length == 0)
        return res.status(404).json(items)
        
    console.log(`GET:: Fetching products from seller ${customer_id}`)
    res.json(items)
}

/**
 * Sends all of the consignment items
 * @param {*} req 
 * @param {*} response 
 */
exports.get_all = async (req, res) => {
    const items = await ConsignLink.AllProducts()
    
    console.log(`GET:: Fetching all products`)
    
    res.json(items)
}

/**
 * Creating a new product and putting it into the database
 * Returns the ID of the new item
 * @param {} req 
 * @param {*} res 
 */

exports.post_item = async (req, res) => {
    
    let img = (req.files.length > 0) ? host+"/images/"+req.files[0].filename: ""
    // the img file, if any, is passed through the FormData object where we can read .files through multer middleware

    let fields = req.body // must insert image
    
    fields['image'] = img
    
    const inserted_product = await ConsignLink.InsertProduct(fields)
    if(!inserted_product)
        return res.status(500);
    
    // Send the new product_id over 
    console.log(`POST:: Created item ${inserted_product.PRODUCT_ID}`)
    res.json(inserted_product)
    

}

exports.delete_item = async (req, res) => {
    
    // gather the image before the link is lost
    let data = req.body
    let myid = structuredClone(data['id'])
    const items = await ConsignLink.GetProductByID(myid)
    let img = items[0]["EXTENDED_JSON"]["image"]

    // delete this image because the item will be removed next
    deleteByURL(img)

    await ConsignLink.DeleteProduct(req.body)
    
    res.json('complete')
    

}

/**
 * Update the item TODO BY AMIT
 * @param {*} req 
 * @param {*} res 
 */
exports.update_item = async (req, res) => {
    // Fetch the current and the new product
    const updated_product = JSON.parse(req.body.product)

    console.log("Updating: ", updated_product.PRODUCT_ID)
    const [old_product] = await ConsignLink.GetProductByID(updated_product.PRODUCT_ID)

    // Get the new changelog
    const changelog = GenerateLogs(req.user, old_product, updated_product)

    // update the changelog for the new product
    updated_product.EXTENDED_JSON.logs = changelog


    if (req.files && req.files.length > 0) // we are changing the image
    {
      let img = host+"/images/"+req.files[0].filename
      // the img file, if any, is passed through the FormData object where we can read .files through multer middleware
      
      // UPdate the image field with the URL
      updated_product.EXTENDED_JSON.image = img

      // Delete the old image
      deleteByURL(req.body.prevImg)
    }
    
    // Then call consignlink save product, push it to the server
    const product = await ConsignLink.UpdateProduct(updated_product)

    console.log(`PUT:: Updated product ${product.PRODUCT_ID}`)
    res.send(product)
}

// Gets date, in a lovely way
function now()
{
    let currentdate = new Date()
    let datetime =
        (currentdate.getMonth()+1)  + "/" 
    + currentdate.getDate() + "/"
    + currentdate.getFullYear() + " @ "  
    + ((currentdate.getHours() > 12) ? currentdate.getHours() - 12 : currentdate.getHours()) + ":"  
    + ( (String(currentdate.getMinutes()).length > 1) ? String(currentdate.getMinutes()) : "0" + String(currentdate.getMinutes()))

    return datetime
}

/**
 * Generates logs
 * @param {*} o Old product object
 * @param {*} n New product object
 */
const GenerateLogs = (staff_user, o, n) => {
    
    // Fetch the logs object from the current product (old, or new it doesn't really matter)
    let logs
    try {
        logs = JSON.parse(o.EXTENDED_JSON.logs)
    } catch (error) {
        logs = o.EXTENDED_JSON.logs
    }

    const {customer_id, name} = staff_user

    // Create deltas
    let deltas = []
    GenerateDeltasRecurse(o, n, deltas)
    
    // Create a new log object with the date, staff id, and the differences
    let log = {
        datetime: now(),
        rawdate: Date.now(),
        staff_id: customer_id,
        staff_name: name,
        action: "updated",
        changes: deltas
    }

    logs.push(log)

    // Return it
    return logs
}

const GenerateDeltasRecurse = (o, n, d) => {
    const diffs = updatedDiff(o, n) // Fetch the diffs
    if (!diffs)
        return d
    const keys = Object.keys(diffs) // Fetch the diff keys
    if(keys.length == 0) // Check if its empty, return 
        return d

    keys.forEach(key => { // For each key
        if(typeof o[key] === 'object') {// If it's an object, we want to recurse
            GenerateDeltasRecurse(o[key], n[key], d) // Call it on the subobject
        } else { // Otherwise, push the delta
            d.push({ // With the key
                key: key,
                old: o[key], // The old value
                new: n[key] // And the new value
            })
        }
    })
}

// FIXME convert this to a recursive function that goes into every object and does a diff check
const GenerateDeltas = (o, n) => {
    let deltas = [] // List of changes

    const diffs = updatedDiff(o, n) // All the differences
    const keys = Object.keys(diffs) // The keys for those diffs

    keys.forEach(key => { // FOr each key whose value was changed
        if(key != 'EXTENDED_JSON') // If it's not in the extended
            deltas.push( { // Push a new delta with the key
                key: key,
                old: o[key], // The old value
                new: n[key] // And the new value
            })
        else { // If there were updates to the extended json
            const ext_diffs = updatedDiff(o.EXTENDED_JSON, n.EXTENDED_JSON) // Check the differences
            const ext_keys = Object.keys(ext_diffs) // Grab their keys 
            ext_keys.forEach(ext_key => { // For each of those
                if(ext_key != 'description') {
                    deltas.push( { // Push a new delta
                        key: ext_key, // With the old key
                        old: o.EXTENDED_JSON[ext_key], // The old value
                        new: n.EXTENDED_JSON[ext_key] // And the new value
                    })
                } else {
                    const des_diffs = updatedDiff(o.EXTENDED_JSON.description, n.EXTENDED_JSON.description)
                    const des_keys = Object.keys(des_diffs)
                    des_keys.forEach(des_key => {
                        deltas.push( {
                            key: des_key,
                            old: o.EXTENDED_JSON.description[des_key],
                            new: n.EXTENDED_JSON.description[des_key]
                        })
                    })
                }
            })
        }
    })
    return deltas
}
