'use strict';

var mongoose = require('mongoose');
var moment = require('moment');
var User = require('./user');

var beerSchema = new mongoose.Schema({
    beer: { type: String, required: true },
    beerid: {type: String},
    rating: { type: String, default: 'N/A' },
    comment: {type: String},
    sampled: {type: Boolean, default: false}
});

var Beer = mongoose.model('Beer', beerSchema);

module.exports = Beer;

