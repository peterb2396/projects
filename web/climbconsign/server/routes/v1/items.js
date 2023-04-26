const express = require('express');
const passport = require('passport');
const router = express.Router();

const c_item = require('./controllers/item')

router.get('/items', c_item.get_all)
router.post('/items', c_item.post_item)


module.exports = router;
