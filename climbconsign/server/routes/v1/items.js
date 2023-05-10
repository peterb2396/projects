const express = require('express');
const passport = require('passport');
const router = express.Router();
const multer = require("multer");
const fs = require('fs');

const host = "http://localhost:1337"

const c_item = require('./controllers/item')

// Image reception handling
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/images");
    },
    filename: (req, file, cb) => {
      const ext = file.mimetype.split("/")[1];
      cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
    },
  });
  
  const multerFilter = (req, file, cb) => {
    if (file.mimetype.split("/")[1] === "png" || file.mimetype.split("/")[1] === "jpg" || file.mimetype.split("/")[1] === "jpeg") {
      cb(null, true);
    } else {
      cb(new Error("Please upload an image"), false);
    }
  };
  
  const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
  });


  
// Fetching methods
router.get('/', c_item.get_all)

router.get('/from/:customer_id', c_item.get_all_from_seller)
router.get('/:product_id', c_item.get_item)
router.get('/:product_id/label', c_item.print_label)

// Posting methods (we want them to re-authenticate)
router.post('/', passport.authenticate('pin'), upload.array("image"), c_item.post_item)
//router.post('/', upload.array("image"), c_item.post_item)
//router.post('/update', upload.array("image"), c_item.update_item)
router.post('/delete', c_item.delete_item)

// Updating methods (we also want authentication for these)
router.put('/:product_id', passport.authenticate('pin'), upload.array("image"), c_item.update_item)

module.exports = router;
