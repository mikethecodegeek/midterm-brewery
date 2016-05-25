var express = require('express');
var router = express.Router();
var Item = require('../models/items');

router.get('/', (req,res)=> {

    Item.find({})
        .exec((err, data) => {
            if (err) {
                console.log(err)
            }
            else {
                res.send(data);
            }

        });
});

router.post('/createitem', (req,res)=> {
    console.log('req:', req.body);
        Item.create(req.body, (err, bird) => {
            res.status(err ? 400 : 200).send(err || bird);
        });
});

router.get('/:id', (req,res)=> {
    console.log(req.params.id)
    Item.findById(req.params.id, (err,data) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(data);
        }
    })
});


router.delete('/:id', (req,res)=> {
    Item.findByIdAndRemove(req.params.id, (err,data)=> {
        if (err){
            console.log(err);
        }
        else {
            res.send(data);
        }
    });
});

router.put('/:id', (req,res)=> {
    Item.findByIdAndUpdate(req.params.id,{$set: req.body}, {new:true}, (err,data)=> {
        if (err){
            console.log(err);
        }
        else {
            res.send(data);
        }
    });
});




module.exports = router;

