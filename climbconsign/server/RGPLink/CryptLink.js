/**
 * This Module is the result of Reverse Engineering Rock Gym Pro's Cryptography.
 * 
 * It was initially implemented in C#. The necessiary functionality has succesfully
 * been ported over by use of this module to read any data stored in the XXZ_ encryption
 * and allows for fetching of the MasterEncryptionKey. 
 * 
 * All of the major configuration details (databases, registration, master key, etc.) are
 * stored in the computer's Registry. 
 * \\Computer\HKEY_CURRENT_USER\SOFTWARE\VB and VBA Program Settings\RockGymPRO\Config
 * 
 * (c) 2023 Amit Merchant, All Rights Reserved
 */



const crypto = require('crypto')
const { renderIntoDocument } = require('react-dom/test-utils')
const dpapi = require('win-dpapi')
const Registry = require('winreg')
,   regKey = new Registry({                                       // new operator is optional
      hive: Registry.HKCU,                                        // open registry hive HKEY_CURRENT_USER
      key:  '\\Software\\VB and VBA Program Settings\\RockGymPRO\\Config' // key containing RGP's Config
})

/**
 * Gets the database user
 */
exports.GetDBUser = () => {
  return new Promise(async (resolve, reject) => {
    resolve(await this.GetSetting("dbuser"))
  })
}

/**
 * Gets the database password as plain text
 */
exports.GetDBPass = () => {
  return new Promise(async (resolve, reject) => {
    const pass = await this.GetSetting("dbpass")
    resolve(await this.DecryptXXZ(pass))
  })
}

/**
 * Gets the database name
 */
exports.GetDBName = () => {
  return new Promise(async (resolve, reject) => {
    resolve(await this.GetSetting("dbname"))
  })
}

/**
 * Gets the database server
 */
exports.GetDBServer = async () => {
  return new Promise(async (resolve, reject) => {
    resolve(await this.GetSetting("dbserver"))
  })
}

/**
 * Gets all database config as RegistryItems
 */
exports.GetDBConfigItems = async () => {
  return new Promise(async (resolve, reject) => {
      // Grab all the settings
  const settings = await this.GetAllSettings()
  // Grab and decrypt the db password
  const pass = await this.DecryptXXZ(
    settings.filter(obj => {
      return obj.name === "dbpass"
    })[0].value
  )
    const Config = {}
    
    // Set the pass to the decrypted value
    Config.password = pass
    // Grab the user
    Config.user =  settings.filter(obj => {
      return obj.name === "dbuser"
    })[0].value
    // Grab the db name
    Config.database =  settings.filter(obj => {
      return obj.name === "dbname"
    })[0].value
    // Grab the dbserver
    Config.host =  settings.filter(obj => {
      return obj.name === "dbserver"
    })[0].value
    // Return the config object
    resolve(Config)
  })
}
  
/**
 * Public function to encrypt as XXZ for RGP
 * @param {string} data 
 */
exports.EncryptXXZ = async (data) => {
  return new Promise(async (resolve, reject) => {
    // Fetch the MasterEncryptionKey
    const key = await GetMasterEncryptionKey()
    // Call backend encrypt function w/ key and data
    const res =  encrypt(data, key)
    resolve(res)
  })
}

/**
 * Front of the house function to decrypt XXZ_ data. Returns a callback
 * @param {string} enc 
 * @param {function} callback 
 * @returns 
 */
exports.DecryptXXZ = async (enc) => {
  return new Promise(async (resolve, reject) => {
    // If it's not XXZ_ then it's not encrypted, return it
    if(enc.split('_')[0] != "XXZ") {
      resolve(enc);
    } else {
      const key = await GetMasterEncryptionKey();
      // Get the Master Key
      // Call Decrypt and strip the leading XXZ_
      const res = _DecryptXXZ(enc.split('_')[1], key)
      // Return the decrypted string
      resolve(res);
    }
  })
}

/**
 * Fetch a setting string from the Window's registry
 * Computer\HKEY_CURRENT_USER\SOFTWARE\VB and VBA Program Settings\RockGymPRO\Config
 * Available Keys:
 * dbserver
 * dbuser
 * dbpass
 * dbname
 * CurrentFacilityId
 * LastUpdateVersionCheckAttempt
 * AvailableUpdateDownloadUrl
 * AvailableBuild
 * AvailableUpdateVersion
 * AvailableUpdateReleaseDate
 * SupportActivationLastCheck
 * SupportActivationState
 * LastDatabaseGUID
 * AppBarShowState1
 * LastUpdateVersionCheck
 * ReceiptPrinterMethod
 * ReceiptExtraLineFeeds
 * RequirePINForApps
 * opencashdrawer
 * opencashdrawer_onlycashorcheck
 * cashdrawerstring
 * EasyAutoUpdateEnabled
 * PlayCheckInSounds
 * ReportExceptions
 * SupportActivatedAtLeastOnce
 * @param {string} key 
 * @param {function} callback 
 */
exports.GetSetting = async (key) => {
  return new Promise((resolve, reject) => {
      // Fetch all the keys in the defined regKey
    regKey.values(function (err, items) {
      if (err)
        reject(err)
      else
          // There's probably a better way of doing this, but for now, 
          // We're just iterating till we get a match 
          for (var i=0; i<items.length; i++)
              if(items[i].name == key) // And returning it big-o of n :D
                  resolve(items[i].value)
    });
  })
}

/**
 * Fetches all settings from the config. 
 * These are RegistryItems objects with three fields:
 * name, type, value 
 */
exports.GetAllSettings = async () => {
  return new Promise((resolve, reject) => {
    // Fetch values from the view
    regKey.values(function (err, items) {
      if (err)
        reject(err);
      else // REturn all of the RegistryItems
        resolve(items)
    });
  })
}

/**
 * Encrypts as XXZ
 * @param {uint8array} data 
 * @param {string} key 
 * @param {function} callback 
 * @returns callback with encrypted string
 */
const encrypt = (data, key) => {
  // creates an array of 8 random for the IV
  //const randomBits = ('binary').split('').map(Number);
  const iv = crypto.randomBytes(8);
  const algorithm = "des-ede3-cbc";
  // Create cypher with the hashed key, 
  const cipher = crypto.createCipheriv(algorithm, HashKey(key), iv);
  // Encrypt the data
  const encrypted = cipher.update(data);
  // Fetch the encrypted cyper
  const finalBuffer = Buffer.concat([encrypted, cipher.final()]);
  // Concat the string with th leading XXZ_
  const encryptedbase64 = "XXZ_" + iv.toString('base64')  + finalBuffer.toString('base64')
  return (encryptedbase64)
}

/**
 * The backbone function that does some checks and actually calls the decryption functions
 * @param {string} data 
 * @param {string} key 
 */
const _DecryptXXZ = (data, key) => {
  return new Promise((resolve, reject) => {
    // Check that the master key is there
    if(key.length == 0)
    throw new Error("CryptLink: Master Encryption Key required.")
    //Check that it's long enough
    if(data.length < 12)
      throw new Error("CryptLink: Encrypted String Not Long Enouch. Got " +data)
    else {
      try {
        // Split the string and the iv
        const front = data.substring(0,12)
        const back = data.substring(12)
        // Parse the iv and input into uint8 arrays
        const iv = new Uint8Array(Buffer.from(front, 'base64'));
        const input = new Uint8Array(Buffer.from(back, 'base64'));
        // Return to the callback the result of the decryption function
        resolve(decrypt(input, key, iv))

      } catch(e) {
        reject(e)
      }
    } 
  })
}

/**
 * TripleDES Decryption
 * @param {uint8array} data 
 * @param {string} key 
 * @param {uint8array} iv 
 * @returns tripledes decrypted version of data in utf-8
 */
const decrypt = (data, key, iv) => {
  // Set the algo (tripple des)
  const algorithm = "des-ede3-cbc";
  // Create the decypher from the key and initialization vector
  const decipher = crypto.createDecipheriv(algorithm, HashKey(key), iv);
  // Decrypt the string
  let decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
  // Return it in utf-8
  return decrypted.toString('utf-8');
};

/**
 * Computes the Hash of the key which is used in the encryption/decryption
 * @param {string} key 
 * @returns md5 hashed and extended string as a uint8array buffer
 */
const HashKey = (key) => {
  // It's an md5 hash
  const hash = crypto.createHash("md5");
  hash.update(new Uint8Array(Buffer.from(key, 'utf8')));
  // Important step here. It properly expans the normal 128 bit key to 192 for
  // TripleDES (https://stackoverflow.com/questions/59049911/how-to-decrypt-triple-des-in-node-js)
  const hashed = new Uint8Array(Buffer.from(hash.digest()))
  return Buffer.concat([hashed, hashed.slice(0, 8)]);
}

/**
 * Fetch the Master Encryption Key and unencrypt it
 */
const GetMasterEncryptionKey = async () => {
  return new Promise(async (resolve, reject) => {
      // Grab the encrypted entry from the registry
      const key = await this.GetSetting("MasterEncryptionKey")
      // Convert it to a buffer in base64
      const buffer = Buffer.from(key, "base64");    
      // Call the DPAPI to decrypt it
      const decrypted = dpapi.unprotectData(buffer, null, "CurrentUser");
      resolve(decrypted.toString('utf8'))
    });

}
