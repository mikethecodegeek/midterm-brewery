'use strict';

var app = angular.module('angularApp');

app.service('userService',function($http) {
    var profile = {loggedin: false};
    this.setProfile = function(myprofile) {
        profile = myprofile
    };
    this.returnProfile = function(){
        return profile;
    };
    this.getAll = () => {
        return $http.get('./api/users');
    };
    this.getProfile = () => {
        return $http.get('./api/users/profile');
    };

    this.register = newPost => {
        console.log(newPost)
        return $http.post('./api/users/register', {username: newPost.username, email: newPost.email,
            password: newPost.password,
        });
    };
    this.deleteById = id => {
        return $http.delete(`./api/users/${id}`);
    };
    this.viewProfile = id => {
        console.log(id.id);
        return $http.get(`./api/users/${id.id}`);
    };
    this.editById = (id, newPost) => {
        console.log(id);
        return $http.put(`./api/users/${id}`, {name: newPost.name,
            username: newPost.username, email: newPost.email});
    }

    this.login = (user) => {
        return $http.post('./api/users/login/', {email: user.email, password: user.password});
    };
    this.logout = () => {
        //console.log('User:', user)
        return $http.delete('./api/users/logout/');
    };


});

app.service('itemService',function($http) {
    this.getAll = () => {
        return $http.get('./api/items');
    };
    this.createItem = (item) => {
        console.log(item)
        return $http.post('./api/items/createitem', {itemname: item.name}
        );
    };

    this.deleteById = id => {
        return $http.delete(`./api/items/${id}`);
    };
    this.viewItem = id => {
   //     console.log(id);
        return $http.get(`./api/items/${id}`);
    };
    this.editById = (id, newPost) => {
        console.log(id);
        return $http.put(`./api/items/${id}`, {itemname: newPost.name});
    }


});

app.service('beerService',function($http) {
    this.getRandom = () => {
        return $http.get('./api/beer/random');
    };

    this.rateBeer = (beer) => {
        return $http.post('./api/beer/ratebeer', {beer: beer})
    }

    this.notSampled = (beer) => {
        return $http.post('./api/beer/notsampled', {beer: beer})
    }

    this.editById = (id, newRating) => {
    //    console.log(newRating);
        return $http.put(`./api/beer/editbeer/${id}`, {rating: newRating});
    }

    this.sampleBeer = (id, user) => {
        //   console.log(user);
        return $http.put(`./api/users/samplebeer/${id}`, {user: user});
    }

    this.unSample = (id, user) => {
          //  console.log(user);
        return $http.put(`./api/users/unsamplebeer/${id}`, {user: user});
    }

});
