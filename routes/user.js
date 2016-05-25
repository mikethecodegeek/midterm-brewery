var express = require('express');
var router = express.Router();
var User = require('../models/user');
var request = require('request');
var jwt = require('jsonwebtoken');

router.get('/', (req,res)=> {
     User.find({})
        .exec((err, data) => {
            if (err) {
                console.log(err)
            }
            else {
                res.send(data);
            }

        });
});

router.post('/register', (req,res) => {
    User.register(req.body, (err, thisuser)=> {
        console.log('err', err)
        console.log('thisuser:', thisuser);
        res.status(err ? 400 : 200).send(err || thisuser);
    })
});

router.get('/profile', User.auth(), (req,res) => {
    //console.log(req.user);
    //console.log(req.user.populate('items'))
    res.send(req.user);
});

router.post('/login', (req,res) => {
    console.log('LOGIN body', req.body)
    User.authenticate(req.body, (err, token) => {
        if (err){
            res.status(400).send(err);
        }
        else {
            res.cookie('accessToken', token).send(token);
        }
    })
});

router.delete('/logout', (req, res) => {
    res.clearCookie('accessToken').send();
});

router.get('/verify/:token', (req, res) => {
    var token = req.params.token;

    User.verify(token, err => {
        if (err) {
            res.redirect('/#/verifyfail');
        } else {
            res.redirect('/#/verifysuccess');
        }
    });
});

router.get('/:id', (req,res)=> {
    console.log(req.params.id)
    User.findById(req.params.id, (err,data) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(data);
        }
    })
});


router.delete('/:id', (req,res)=> {
    User.findByIdAndRemove(req.params.id, (err,data)=> {
        if (err){
            console.log(err);
        }
        else {
            res.send(data);
        }
    });
});

router.put('/:id', (req,res)=> {
    User.findByIdAndUpdate(req.params.id,{$set: req.body}, {new:true}, (err,data)=> {
        if (err){
            console.log(err);
        }
        else {
            res.send(data);
        }
    });
});

router.put('/samplebeer/:id', (req,res)=> {
    //console.log('REQBODY: ', req.body)
    User.find({username:req.body.user},(err,data)=> {
        //console.log(data);
        if (err){
            console.log(err);
        }
        else {
                console.log('params', req.params.id)
            for (var a=0; a< data[0].notsampled.length; a++) {
                console.log('other',data[0].notsampled[a])
                if (data[0].notsampled[a] == req.params.id) {
                    //console.log(data[0].notsampled[a])
                    console.log(data[0].items)
                    data[0].notsampled.splice(a,1);
                    data[0].items.push(req.params.id);
                    console.log(data[0].notsampled)
                }
            }
            data[0].save();
            res.send(data);
        }
    });
});

router.put('/unsamplebeer/:id', (req,res)=> {
    //console.log('REQBODY: ', req.body.user)
    User.find({username:req.body.user}, (err,data)=> {
       // console.log(data);
        if (err){
            console.log(err);
        }
        else {
           // console.log('params', req.params.id)
            console.log(data[0])
            for (var a=0; a< data[0].items.length; a++) {
               // console.log('other', data[0].items[a])
                // console.log(data[0].notsampled[a])
                if (data[0].items[a] == req.params.id) {
                    //console.log(data[0].notsampled[a])
                    //console.log(data[0].items)
                    console.log('yay')
                    data[0].items.splice(a,1);
                    data[0].notsampled.push(req.params.id);
                    console.log(data[0].items)
                }
            }
            console.log(data)
            data[0].save();
            res.send(data);
        }
    });
});



module.exports = router;

