var express = require('express');
var router = express.Router();

router.use('/users', require('./user'));
router.use('/items', require('./item'));
router.use('/beer', require('./beer'));


module.exports = router;
