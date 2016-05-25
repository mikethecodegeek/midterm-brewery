'use strict';
var app = angular.module('angularApp');

app.controller('homeCtrl', function(userService, $scope, $state) {
    
    $scope.loggedin = false;
    var currentUser = userService.getProfile()
        .then(stuff => {
            console.log(stuff);
            $scope.loggedin =true;
        });


    $scope.logout = function () {
        userService.logout()
            .then(stuff => {
               $scope.loggedin = false;
                $state.go('home');
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
    //console.log($state.params.id)
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

app.controller('newItemCtrl', function(userService, itemService, $scope, $state) {
    var user = "";
       userService.getProfile()
        .then(stuff => {
           // $scope.apiData = stuff;
             console.log(stuff)
            user= stuff;
        });
      // console.log(currentUser)
    $scope.postItem = function() {
        var newPost = {
            name: $scope.newName,
        }
        itemService.createItem(newPost)
            .then(stuff => {
                $scope.listing = stuff;
                    $state.go('myprofile');
            });
    }


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
app.controller('profileCtrl', function(userService, $scope, $state) {
    console.log('Profiles');
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

app.controller('viewprofileCtrl', function(userService, $scope, $state) {

    userService.viewProfile($state.params)
        .then(stuff => {
            $scope.apiData = stuff;
            console.log($scope.apiData)
            if ($scope.apiData.status === 200) {
                $scope.loggedin = true;
            }
        });

});

    
