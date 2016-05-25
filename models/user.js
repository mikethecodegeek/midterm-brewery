'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var moment = require('moment');
var jwt = require('jsonwebtoken');
//var Beer = require('./items');
var JWT_SECRET = process.env.JWT_SECRET || 'assasadsasadfsadf';

var userSchema = new mongoose.Schema({
    name: {type: String},
    email: { type: String, unique: true },
    username: {type: String, unique: true},
    password: { type: String },
    admin: { type: Boolean, default: false },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Beer' }],
    notsampled: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Beer' }]
});


userSchema.statics.auth = role => {
    return function (req,res,next) {
       // console.log('TOKEN:', req.body)
        var token = req.cookies.accessToken;

        jwt.verify(token, JWT_SECRET, (err, payload) => {
            console.log(payload)
            if(err) return res.status(401).send({error: 'Authentication required.'});

            User.findById(payload._id).populate('items notsampled').exec(function (err, user) {
                if(err || !user) return res.status(401).send({error: 'User not found.'});

                req.user = user;

                if(role === 'admin' && !req.user.admin) {
                    return res.status(403).send({error: 'Not authorized.'});
                }

                next();

            }) //.select('-password');
        });
    }
}



userSchema.statics.register = (userObj, cb) => {

    console.log(userObj);
    User.findOne({email: userObj.email}, (err, dbUser) => {
        if(err || dbUser) return cb(err || {error: 'Email not available.'});

        bcrypt.hash(userObj.password, 12, (err, hash) => {
            if(err) return cb(err);

            var user = new User({
                email: userObj.email,
                password: hash,
                username: userObj.username,
                admin: false
            });
            console.log(user);

            user.save((err, savedUser) => {
                console.log("err", err)
                     savedUser.password = null;
                     cb(err, savedUser);
            });
        });
    });
};


userSchema.statics.authenticate = (userObj, cb) => {
    User.findOne({email: userObj.email}, (err, dbUser) => {
        if(err || !dbUser) return cb(err || { error: 'Authentication failed.  Invalid email or password.' });

        bcrypt.compare(userObj.password, dbUser.password, (err, isGood) => {
            if(err || !isGood) return cb(err || { error: 'Authentication failed.  Invalid email or password.' });

            var token = dbUser.generateToken();

            cb(null, token);
        });
    });
};

userSchema.methods.getCurrentUser = function() {
    User.findById(userId).populate('items').exec(function (err, user, cb) {
        return cb(user);
    })
}
userSchema.methods.generateToken = function() {
    var payload = {
        _id: this._id,
        exp: moment().add(1, 'day').unix()
    };

    return jwt.sign(payload, JWT_SECRET);
};



userSchema.statics.verify = (token, cb) => {
    jwt.verify(token, JWT_SECRET, (err, payload) => {
        if (err) return cb(err);

        User.findById(payload._id, (err, user) => {
            if (err || !user) return cb(err || 'User not found.');

            user.verified = true;

            user.save(cb);
        });
    });
};

userSchema.statics.rateBeer = function(beer, user, cb) {
    User.findOne({username: user}, function(err, dbuser) {
        dbuser.items.push(beer._id);
        dbuser.save(err, function() {
            if (err){cb(err)}
        })
    })
    cb(beer);
}

userSchema.statics.notSampled = function(beer, user, cb) {
    User.findOne({username: user}, function(err, dbuser) {
        console.log('err', err)
        console.log('DBUSER', dbuser);
        dbuser.notsampled.push(beer._id);
        dbuser.save(err, function() {
            if (err){cb(err)}
        })
    })
    cb(beer);
}

var User = mongoose.model('User', userSchema);

module.exports = User;
