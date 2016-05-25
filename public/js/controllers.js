'use strict';
var app = angular.module('angularApp');

app.controller('homeCtrl', function(userService, beerService, $scope, $state) {

    $scope.loggedin = false;
    var username ='';
    var currentUser = userService.getProfile()
        .then(stuff => {
            console.log(stuff)
            $scope.loggedin =true;
            username = stuff.data.username;
        });


    $scope.logout = function () {
        userService.logout()
            .then(stuff => {
               $scope.loggedin = false;
                $state.go('home');
            });
    }

    $scope.getRandomBeer = function() {
        var beer = {
            beer: $scope.beer.name,
            beerid: $scope.beer.id,
            comment: 'N/A',
            rating: 'N/A',
            sampled: false,
            user: username
        }

        // console.log(beer);
        beerService.notSampled(beer)
            .then(stuff => {
                //$scope.listings = stuff.data;
                console.log(stuff)
            });
        getBeer();
    }
    function getBeer() {
        beerService.getRandom()
            .then(beer => {
                $scope.beer = beer.data.data;
            })
    }

    getBeer();

    $scope.rate = function() {
        var beer = {
            beer: $scope.beer.name,
            beerid: $scope.beer.id,
            comment: $('#comment').val(),
            rating: $('#rating').val(),
            sampled: true,
            user: username
        }

       // console.log(beer);
        beerService.rateBeer(beer)
            .then(stuff => {
                //$scope.listings = stuff.data;
                console.log(stuff)
            });
    }



});


app.controller('itemCtrl', function(itemService, $scope, $state) {
    itemService.getAll()
        .then(stuff => {
            $scope.listings = stuff.data;

        });

});

app.controller('itemDetailCtrl', function(userService, itemService, $scope, $state) {
    var user = "";
    userService.getProfile()
        .then(stuff => {
            user= stuff;
        });
    itemService.viewItem($state.params.id)
        .then(stuff => {
            $scope.listing = stuff.data;

        });


});




app.controller('loginCtrl', function(userService, $scope, $state, $auth) {
    $scope.authenticate = provider => {
        $auth.authenticate(provider)
    };

    $scope.login = function() {
        var thisuser = {
            email: $scope.email,
            password: $scope.password
        };
        userService.login(thisuser)
            .then( (stuff) => {
                console.log(stuff)
                userService.setProfile(stuff)
                $state.go('myprofile')
            });
    }

});
app.controller('profileCtrl', function(userService, beerService, $scope, $state) {
  //  console.log('Profiles');
            userService.getProfile()
                .then(stuff => {
                    $scope.apiData = stuff
                console.log($scope.apiData)
    })

    $scope.logout = function () {
        userService.logout()
            .then(stuff => {
                $scope.loggedin = false;
                $state.go('home');
            });
    }

    $scope.editBeer = function(beer) {
      //  console.log(beer)
        var rating = $('#newrating').val();

        beerService.editById(beer._id, rating)
            .then(rating => {
        //    console.log(rating);
                userService.getProfile()
                    .then(stuff => {
                        $scope.apiData = stuff
            //            console.log($scope.apiData)
                    })
        })
    }

    $scope.sampleBeer= function(beer) {
        beerService.sampleBeer(beer._id, $scope.apiData.data.username)
            .then(beer => {
                //$scope.listings = stuff.data;
                console.log(beer)
            });
    }

    $scope.unsampleBeer= function(beer) {
        beerService.unSample(beer._id, $scope.apiData.data.username)
            .then(stuff => {
                //$scope.listings = stuff.data;
                console.log(beer)
            });
    }

});
app.controller('registerCtrl', function(userService, $scope, $state) {
    $scope.register = function() {
        var thisuser = {
            email: $scope.newEmail,
            username: $scope.newUsername,
            password: $scope.newPassword,

        };
        userService.register(thisuser)
            //console.log(thisuser)
            .then((stuff) => {
            $state.go('home')
         });
    }


});

app.controller('editCtrl', function(userService, $scope, $state) {
    userService.getProfile()
        .then(stuff => {
            console.log(stuff)
            $scope.apiData = stuff;
            $scope.editUsername = stuff.data.username;
        });

    $scope.editUser = function() {
        var thisuser = {
            username: $scope.editUsername,
            email: $scope.editEmail,
        };
        userService.editById($scope.apiData.data._id, thisuser)
            .then(stuff => {
                $scope.apiData = stuff;
                $state.go('myprofile')
                //   console.log($scope.apiData)
            });
    }

});

app.controller('viewprofileCtrl', function(userService, beerService, $scope, $state) {

    userService.viewProfile($state.params)
        .then(stuff => {
            $scope.apiData = stuff;
            console.log($scope.apiData)
            if ($scope.apiData.status === 200) {
                $scope.loggedin = true;
            }
        });




});


