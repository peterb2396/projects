const mysql = require('mysql2/promise')
const CryptLink = require('./CryptLink')

// Make sure to have the host set to 127.0.0.1 instead of localhost so that we can connect for some reason. 

const initialize = async () => {
    // If there is no pool created yet
    if(!this.pool) { 
        console.log("Initializing connection pool")
        // Fetch our configuration items
        const config = await CryptLink.GetDBConfigItems()
        // and create a pool
        this.pool = await mysql.createPool(config)
    }
    // Return either the instantiated pool, or the new one we just created
    return(this.pool)
}
module.exports.initialize = initialize;


const tableExists = async(pool, tableName) => {
    try {
        const query = `SELECT 1 FROM ${tableName} LIMIT 1;`;
        await pool.execute(query);
        return true;
    } catch (err) {
        return false;
    }
}
module.exports.tableExists = tableExists



// Kinda weird.. but it works ig.
let pool = initialize();
module.exports.pool = pool