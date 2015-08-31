/**
 * Created by buggy on 8/27/15.
 */
/**
 * Created by HSO on 7/25/15.
 */

"use strict";

angular.module('starter')
    .controller('discountController',
    ['$scope',
        '$ionicGesture',
        '$cordovaGeolocation',
        '$ionicPlatform',
        '$http',
        function ($scope, $ionicGesture, $cordovaGeolocation, $ionicPlatform, $http) {
            var dc = this;

            $ionicPlatform.ready(function () {


                var watchOptions = {
                    frequency: 1000,
                    timeout: 10000,
                    enableHighAccuracy: false // may cause errors if true
                };

                var watch = $cordovaGeolocation.watchPosition(watchOptions);

                watch.then(
                    null,
                    function (err) {
                        console.log('ngCordova Location Error: ', err);
                    },
                    function (position) {
                        var lat = position.coords.latitude;
                        var long = position.coords.longitude;

                        var latlong = lat + ',' + long;

                        console.log(latlong);

                        var googleMapApiUrl = 'http://maps.googleapis.com/maps/api/geocode/json?sensor=false&language=en&latlng=' + latlong;

                        $http.get(googleMapApiUrl)
                            .then(function (mapData) {
                                var parsedMapData = mapData.data.results[0].address_components;
                                var street = parsedMapData[0].long_name + ' ' + parsedMapData[1].long_name;
                                var city = parsedMapData[2].long_name;
                                var state= parsedMapData[5].short_name;
                                var country = 'USA';
                                var zipCode = parsedMapData[7].short_name;

                                //http://taxratesapi.avalara.com/account
                                var avalaraApiKey = 'zSQlGO+APfIeAUvwPV/vw6DVFzV0bZPtla/ywaQt3Y86r+VPoDhVLtNn/fAgnbGVmI/6FZdzt2edj4mVo/LtVQ==';
                                var avalaraUrl = 'https://taxrates.api.avalara.com:443/address?country=usa&state=' +
                                state + '&city=' + city + '&postal=' + zipCode + '&street=' + street + '&apikey=' + avalaraApiKey;

                                return $http.get(avalaraUrl);

                            }, function (err) {
                                console.log('google api error: ', err)
                            })
                            .then(function (data) {
                                console.log(data);
                            }, function(err){
                                console.log('error getting tax: ', err);
                            })

                    });

            });

            dc.price = '';
            dc.tax = 9; //percent
            dc.discountPercent = 20; //percent
            dc.totalDiscount = '';
            dc.finalPriceBeforeTax = '';
            dc.finalPrice = '';
            dc.finalTaxAmount = '';


            dc.calculateDiscount = function () {

                if (dc.price) {
                    dc.totalDiscount = dc.price * (dc.discountPercent / 100);
                    dc.finalPriceBeforeTax = ( dc.price - dc.totalDiscount );
                    dc.finalTaxAmount = dc.finalPriceBeforeTax * (dc.tax / 100);
                    dc.finalPrice = dc.finalPriceBeforeTax + dc.finalTaxAmount;
                }
            };

            var priceAmountInputBox = document.querySelector('#price-amount');

            $ionicGesture.on('touch', function (event) {
                if (document.activeElement.id === priceAmountInputBox.id) {
                    // install ionic-plugin-keyboard for this.
                    cordova.plugins.Keyboard.close();
                }
            }, angular.element(document));

        }]);