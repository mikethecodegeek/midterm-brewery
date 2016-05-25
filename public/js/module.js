'use strict';

var app = angular.module('angularApp', ['ui.router', 'satellizer']);
app.config(function($stateProvider, $urlRouterProvider) {
    

    $stateProvider

        .state('home', {
            url: '/',
            templateUrl: '/html/home.html',
            controller: 'homeCtrl'
        })
        .state('viewitems', {
            url: '/items/browse',
            templateUrl: '/html/browselistings.html',
            controller: 'itemCtrl'
        })
        .state('login', {
            url: '/login/',
            templateUrl: '/html/login.html',
            controller: 'loginCtrl'
        })
        .state('myprofile', {
            url: '/myprofile/',
            templateUrl: '/html/userprofile.html',
            controller: 'profileCtrl'
        })
        .state('register', {
            url: '/newuser/',
            templateUrl: '/html/register.html',
            controller: 'registerCtrl'
        })
        .state('editprofile', {
            url: '/profile/edit',
            templateUrl: '/html/editprofile.html',
            controller: 'editCtrl'
        })


    $urlRouterProvider.otherwise('/');

})
