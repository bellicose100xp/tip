// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    })

    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('tabs', {
                url: '/tab',
                cache: false,
                abstract: true,
                templateUrl: 'views/tabs.html'
            })
            .state('tabs.tip', {
                url: '/tip',
                cache: false,
                views: {
                    'tip-tab': {
                        templateUrl: 'views/tip.html',
                        controller: 'mainController as mc'
                    }
                }
            })
            .state('tabs.discount', {
                url: '/discount',
                cache: false,
                views: {
                    'discount-tab': {
                        templateUrl: 'views/discount.html',
                        controller: 'discountController as dc'
                    }
                }

            })
            .state('tabs.single', {
                url: '/single',
                cache: false,
                views: {
                    'single-tab': {
                        templateUrl: 'views/single.html',
                        controller: 'singleController as sc'
                    }
                }

            });

        $urlRouterProvider.otherwise("/tab/single");

    });

