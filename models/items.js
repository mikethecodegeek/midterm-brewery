'use strict';

var mongoose = require('mongoose');
var moment = require('moment');
var User = require('./user');
//console.log(User);
console.log('');
var itemSchema = new mongoose.Schema({
    itemname: { type: String, required: true },
    description: { type: String, default: 'N/A' }
});

var Item = mongoose.model('Item', itemSchema);

module.exports = Item;

