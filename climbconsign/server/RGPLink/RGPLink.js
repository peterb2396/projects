const CryptLink = require("./CryptLink")
const DataLink = require("./DataLink")
const crypto = require('crypto')
const bcrypt = require('bcrypt')


/**
 * Fetches all invoices associated with a select product
 * @param {*} product 
 * @returns 
 */
exports.InvoiceForProduct = async (product) => {
    let conn = null;
    try {
        conn = await DataLink.pool.getConnection()
        const query = `select invoices.* from invoice_items join invoices on invoices.INVOICE_ID = invoice_items.INVOICE_ID where PRODUCT_ID=? AND invoices.VOIDEDINVOICE=0`
        const [invoices] = await conn.query(query, [product.PRODUCT_ID])
        return invoices
    } catch (err) {
        reject(err)
    } finally {
        if(conn) await conn.release()
    }
}

/**
 * Fetches all tax items from the database, usefull for getting the consignment tax bracket
 * @returns An array with all the tax_types
 */
exports.GetAllTaxes = async () => {
    return new Promise(async (resolve, reject) => {
        let conn = null;
        try {
            conn = await DataLink.pool.getConnection()
            const query = 'select * from tax_types'
            const [taxes] = await conn.query(query)
            resolve(taxes)
        } catch (err) {
            reject(err)
        } finally {
            if(conn) await conn.release()
        }
    })
}

/**
 * Fetches tax ID from Code
 * @returns tax_types taxtype_id from a tax_code (ie returns 1137 for code T)
 */
exports.GetTaxByCode = async(tax_code) => {
    return new Promise(async (resolve, reject) => {
        let conn = null
        try {
            conn = await DataLink.pool.getConnection()
            const [[tax]] = await conn.query(`select * from tax_types where lower(tax_code)=lower(?) limit 1;`, [tax_code])
            resolve(tax)
        } catch(err) {
            reject(err)
        } finally {
            // Release the conection
            if (conn) await conn.release()
        }
    })
}

/**
 * Fetches tax percentage from Code
 * @returns int from a tax_code (ie returns 7 for code T)
 */
exports.GetTaxAmountByCode = async(tax_code) => {
    return new Promise(async (resolve, reject) => {
        let conn = null
        try {
            conn = await DataLink.pool.getConnection()
            const [[tax]] = await conn.query(`select * from tax_types where lower(tax_code)=lower(?) limit 1;`, [tax_code])
            resolve(tax['PERCENT100'])
        } catch(err) {
            reject(err)
        } finally {
            // Release the conection
            if (conn) await conn.release()
        }
    })
}

/**
 * Generate a GUID set with a new insertion ID and GUID
 * The way this works is that we create a new thing, and then we do the other thing, and merge it into the final thing and it's all pretty <3
*/
exports.GenerateGUID = async () => {
    return new Promise(async (resolve, reject) => {
        /** RGP Does not auto increment indexes. It has its own system in place to do so which we will implement now.
         * The result will be an object that contains an uuid and an id to use for a new insertion
         */
        const uuid = crypto.randomUUID()
        // First thing it does it create a new UUID,
        // Then it pushes it into the 
        // const connection = (await DataLink).getConnection();
        
        let conn = null
        try {
            // Fetch a connection
            conn = await DataLink.pool.getConnection();

            // Begin a transaction so that we can rollback if we need to
            await conn.beginTransaction();

            // Insert our generated guid into lastid2 along with the postdate
            const [header] = await conn.query(`insert into lastid2 (GUID, POSTDATE) values (?, NOW());`, [uuid]);
            // If it wasn't inserted, reject and rollback
            if(header.affectedRows != 1) {
                await conn.rollback();
                reject("New GUID was not added. Rolling back..")
                
            }

            // Get the ID that was generated from our GUID
            const [response] = await conn.query(`select LASTID from lastid2 where GUID=?`, [uuid]);
            const newid = response[0].LASTID;
            if(!newid) {
               await conn.rollback();
               reject("Failed to fetch lastid from lastid2 for our GUID")
            }

            // Log our GUID
            console.log(`Generated new ID: ${newid} with GUID: ${uuid}`)
            
            // Update the lastid table as well to our newid
            const [update_header] = await conn.query(`update lastid set lastid=?;`, [newid]);
            if(update_header.affectedRows != 1) {
                await conn.rollback();
                reject("Could not update lastid to our new id")
            }

            // Commit our chanes
            await conn.commit();

            // Return an object with the guid and the new id
            resolve({guid:uuid, id:newid})

          } catch (error) {
            if (conn) await conn.rollback();
            throw error;
          } finally {
            // Release the conection
            if (conn) await conn.release();
          }
    })
}



/**
 * Check authentication level for staff
 * db.customers fields include: 
 * STAFF_PASSWORD (XXZ encrypted)
 * STAFF_ACCESS_LEVEL
 * 
 * If authenticated, return a customer
 * If not authenticated, return null
 * 
 * Actually we probably want to encrypt it, then select from customers where staff_pwd = enc
 * nvm, it's different each time due to the encryption. we have to pull everyone who's staff and check
 * the pins one by one i guess. Maybe check and see how it's done in RGP? Yup. That's how they do it. Gross
 */
const AuthPIN = (pin) => {
    return new Promise(async (resolve, reject) => {
        // FIXME use actual permissions instead, for now tho, this is fine
        const query = 'select firstname, lastname, customer_id, customer_type, staff_access_level, staff_password, guid from customers where customer_type="STAFF" and staff_password<>"" and not STAFF_IS_INACTIVE';
        let conn = null
        try {
            conn = await DataLink.pool.getConnection()
            const [customers] = await conn.query(query)

            // Go through each valid staff user  
            for(var i = 0; i < customers.length; i++)
            {   // Decrypt their password
                const decrypted = await CryptLink.DecryptXXZ(customers[i]['staff_password'])
                if(decrypted === pin) // If we find a match, theyre a valid staff user
                { 
                    const user = customers[i]
                    // Return their customerid, guid, and 
                    resolve({customer_id:user['customer_id'], name: `${user['lastname']}, ${user['firstname']}`, staff_access_level: user['staff_access_level'], guid: user['guid']});
                }
            }
            resolve(null)

        } catch (err) {
            console.error(err); reject(err)
        }
        finally {
            if(conn) await conn.release() 
        }        
    })   
}
module.exports.AuthPIN = AuthPIN