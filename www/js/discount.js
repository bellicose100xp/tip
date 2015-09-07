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
            dc.tax = 0; //percent
            dc.discountPercent = 20; //percent
            dc.totalDiscount = '';
            dc.finalPriceBeforeTax = '';
            dc.finalPrice = '';
            dc.finalTaxAmount = '';
            dc.location = '';
            dc.manualLocation = false;
            dc.zipCode = '';
            dc.showZipCodeInputBox = false;

            var getLocationAndTax = function () {
                var posOptions = {timeout: 10000, enableHighAccuracy: false};

                $cordovaGeolocation
                    .getCurrentPosition(posOptions)
                    .then(function (position) {
                        var lat = position.coords.latitude;
                        var long = position.coords.longitude;
                        var bingMapKey = 'AmOPY6FCG-S92EQBa10xTz3r-r9ki7b_ieB1xYrQNnWqud_kWVjC9ttYudmJUU7Z';

                        var latlong = lat + ',' + long;

                        // var latlong = '33.744086,-117.989997'; //test

                        // console.log(latlong);

                        var bingMapApiUrl = 'https://dev.virtualearth.net/REST/v1/Locations/' + latlong + '?o=json&key=' + bingMapKey;

                        $http.get(bingMapApiUrl)
                            .then(function (mapData) {

                                //  console.log(mapData.data.resourceSets[0].resources[0].address);

                                var bingMapAddress = mapData.data.resourceSets[0].resources[0].address;

                                var street = bingMapAddress.addressLine;
                                street = street.replace(/ /g, '+');
                                var city = bingMapAddress.locality;
                                var state = bingMapAddress.adminDistrict;
                                var zipCode = bingMapAddress.postalCode;
                                //   console.log(street, city, state, zipCode);
                                dc.location = city + ', ' + state;

                                //http://taxratesapi.avalara.com/account
                                // var avalaraApiKey = 'zSQlGO+APfIeAUvwPV/vw6DVFzV0bZPtla/ywaQt3Y86r+VPoDhVLtNn/fAgnbGVmI/6FZdzt2edj4mVo/LtVQ==';
                                var avalaraApiKey = 'zSQlGO%2BAPfIeAUvwPV%2Fvw6DVFzV0bZPtla%2FywaQt3Y86r%2BVPoDhVLtNn%2FfAgnbGVmI%2F6FZdzt2edj4mVo%2FLtVQ%3D%3D';
                                var avalaraUrl = 'https://taxrates.api.avalara.com:443/address?country=usa&state=' +
                                    state + '&city=' + city + '&postal=' + zipCode + '&street=' + street + '&apikey=' + avalaraApiKey;

                                return $http.get(avalaraUrl);

                            }, function (err) {
                                console.log('bing map api error: ', err)
                            })
                            .then(function (tax) {
                                // console.log(tax);
                                dc.manualLocation = false;
                                dc.tax = tax.data.totalRate;
                                // console.log(tax.data.totalRate);
                            }, function (err) {
                                dc.manualLocation = true;
                                dc.location = '';
                                console.log('error getting tax: ', err);
                            })

                    }, function (err) {
                        console.log('ngCordova Location Error: ', err);
                    });

            };

            var getZipAndTax = function () {
                var avalaraApiKey = 'zSQlGO%2BAPfIeAUvwPV%2Fvw6DVFzV0bZPtla%2FywaQt3Y86r%2BVPoDhVLtNn%2FfAgnbGVmI%2F6FZdzt2edj4mVo%2FLtVQ%3D%3D';
                var avalaraUrl = 'https://taxrates.api.avalara.com:443/postal?country=usa&postal=' + dc.zipCode + '&apikey=' + avalaraApiKey;
                $http.get(avalaraUrl)
                    .then(function (tax) {
                        // console.log(tax);
                        dc.manualLocation = false;
                        dc.location = dc.zipCode.toString();
                        dc.tax = tax.data.totalRate;
                        var zipCodeApiKey = 'SOHGB1vrpdjLvbjS42ULwhx56SIxg7q9V7Qx9lYzyik3uDVyGPjd7RieK1L18ba4';
                        var requestUrl = 'https://www.zipcodeapi.com/rest/' + zipCodeApiKey + '/info.json/' + dc.location + '/degrees';
                        // console.log(tax.data.totalRate);

                        return $http.get(requestUrl);
                    }, function (err) {
                        dc.manualLocation = true;
                        dc.location = "Invalid Zip Code";
                        console.log('error getting tax: ', err);
                    })
                    .then(function (zipCodeData) {
                        //  console.log(zipCodeData.data);
                        dc.location = zipCodeData.data.city + ', ' + zipCodeData.data.state;
                    }, function (err) {
                        dc.location = "Invalid Zip Code";
                    });
            };


            $ionicPlatform.ready(getLocationAndTax); // run once on app load;


            dc.calculateDiscount = function () {
                console.log(dc.price);
                if (dc.price) {
                    console.log(isNaN(dc.price));

                    if (isNaN(dc.price)) {
                        dc.price = eval(dc.price);
                        console.log('isNan', dc.price);
                    }

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

            dc.recalculateTaxByLocationAgain = function () {
                getLocationAndTax();
            };

            dc.checkTaxInputChange = function () {
                dc.manualLocation = true;
                dc.location = '';
            };

            dc.toggleZipCodeLabel = function () {
                dc.manualLocation = false;
                dc.showZipCodeInputBox = true;
            };

            dc.getZipAndTax = function () {
                dc.showZipCodeInputBox = false;
                getZipAndTax();
            }


        }]);