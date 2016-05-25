/**
 * Created by Admin on 5/25/16.
 */
var express = require('express');
var path = require('path');
var router = express.Router();
var request=require('request');
var Beer = require('../models/items');
var User = require('../models/user');
// var BreweryDb = require('brewerydb-node');
// var brewdb = new BreweryDb('fcee737176301e15d6f8cb15c18cc1a2');



// router.get('/featured', (req, res) => {
//     request('http://api.brewerydb.com/v2/featured?key=fcee737176301e15d6f8cb15c18cc1a2', function (error, response, body) {
//         if (!error && response.statusCode == 200) {
//             console.log(JSON.parse(body))
//             var parsed = JSON.parse(body)
//             res.send(parsed)
//         }
//     })
// });



router.get('/random', (req, res) => {
    request('http://api.brewerydb.com/v2/beer/random?key=fcee737176301e15d6f8cb15c18cc1a2', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(JSON.parse(body))
            var parsed = JSON.parse(body)
            res.send(parsed)
        }
    })
});

router.post('/ratebeer', (req, res) => {
    //res.send(req.body);
    console.log(req.body.beer);
    Beer.create(req.body.beer, (err, beer) => {
        if (err) {
            res.status(400).send(err);
        }
        else {
            beer.save();
            User.rateBeer(beer, req.body.beer.user, function() {
                res.status(200).send(beer)
            })
        }

    });
});

router.post('/notsampled', (req, res) => {
    //res.send(req.body);
    console.log(req.body.beer);
    Beer.create(req.body.beer, (err, beer) => {
        if (err) {
            res.status(400).send(err);
        }
        else {
            beer.save();
            User.notSampled(beer, req.body.beer.user, function() {
                res.status(200).send(beer)
            })
        }

    });
});

router.delete('/deletebeer/:id', (req, res) => {
    Beer.findByIdAndRemove(req.params.id, (err,data)=> {
        if (err){
            console.log(err);
        }
        else {
            res.send(data);
        }
    });
});

router.put('/editbeer/:id', (req,res)=> {
    console.log('REQBODY: ', req.body)
    Beer.findByIdAndUpdate(req.params.id,{$set: req.body}, {new:true}, (err,data)=> {
        console.log(data);
        if (err){
            console.log(err);
        }
        else {
            res.send(data);
        }
    });
});

router.get('/', (req,res)=> {

    Beer.find({})
        .exec((err, data) => {
            if (err) {
                console.log(err)
            }
            else {
                res.send(data);
            }

        });
});


module.exports = router;

