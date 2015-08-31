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
            dc.price = '';
            dc.tax = 7; //percent
            dc.discountPercent = 20; //percent
            dc.totalDiscount = '';
            dc.finalPriceBeforeTax = '';
            dc.finalPrice = '';
            dc.finalTaxAmount = '';
            dc.location = '';

            $ionicPlatform.ready(function () {


                var watchOptions = {
                    frequency: 5000,
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

                       // console.log(latlong);

                        var googleMapApiUrl = 'http://maps.googleapis.com/maps/api/geocode/json?sensor=false&language=en&latlng=' + latlong;

                        $http.get(googleMapApiUrl)
                            .then(function (mapData) {
                              //  console.log(mapData);
                                var parsedMapData = mapData.data.results[0].address_components;
                                var street = parsedMapData[0].long_name + ' ' + parsedMapData[1].long_name;
                                street = street.replace(/ /g, '+');
                               // console.log(street);
                                var cityOriginal = parsedMapData[3].long_name
                                var city = cityOriginal.toLowerCase();
                                var state= parsedMapData[6].short_name.toLowerCase();
                                var zipCode = parsedMapData[8].short_name;
                                //console.log(street, city, zipCode, state);
                                dc.location = cityOriginal + ' ,' + state.toUpperCase();

                                //http://taxratesapi.avalara.com/account
                               // var avalaraApiKey = 'zSQlGO+APfIeAUvwPV/vw6DVFzV0bZPtla/ywaQt3Y86r+VPoDhVLtNn/fAgnbGVmI/6FZdzt2edj4mVo/LtVQ==';
                                var avalaraApiKey = 'zSQlGO%2BAPfIeAUvwPV%2Fvw6DVFzV0bZPtla%2FywaQt3Y86r%2BVPoDhVLtNn%2FfAgnbGVmI%2F6FZdzt2edj4mVo%2FLtVQ%3D%3D';
                                var avalaraUrl = 'https://taxrates.api.avalara.com:443/address?country=usa&state=' +
                                state + '&city=' + city + '&postal=' + zipCode + '&street=' + street + '&apikey=' + avalaraApiKey;

                                return $http.get(avalaraUrl);

                            }, function (err) {
                                console.log('google api error: ', err)
                            })
                            .then(function (tax) {
                               // console.log(tax);
                                dc.tax = tax.data.totalRate;
                                //console.log(tax.data.totalRate);
                            }, function(err){
                                dc.location = '';
                                console.log('error getting tax: ', err);
                            })

                    });

            });




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