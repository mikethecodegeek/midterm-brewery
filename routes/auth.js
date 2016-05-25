var express = require('express');
var path = require('path');
var router = express.Router();
var jwt = require('jsonwebtoken');
var JWT_SECRET = process.env.JWT_SECRET || 'assasadsasadfsadf';
var request = require('request');
var qs = require('querystring');
var User = require('../models/user')





module.exports = router;
