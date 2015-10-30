/**
 * Created by buggy on 8/27/15.
 */
/**
 * Created by HSO on 7/25/15.
 */

"use strict";

angular.module('starter')
    .controller('singleController',
        ['$scope',
            '$ionicGesture',
            '$cordovaGeolocation',
            '$ionicPlatform',
            '$http',
            function ($scope, $ionicGesture, $cordovaGeolocation, $ionicPlatform, $http) {
                var sc = this;
                sc.price = '';
                sc.tax = 0; //percent
                sc.tipPercent = 10; //percent
                sc.totalDiscount = '';
                sc.subtotal = '';
                sc.finalPrice = '';
                sc.taxTotal = '';
                sc.location = '';
                sc.manualLocation = true;
                sc.zipCode = '';
                sc.showZipCodeInputBox = false;
                sc.advanced = true;
                sc.tipBeforeTax = false;
                sc.inputPriceAsIs = '';
                sc.discountPercentAdditional = 0;
                sc.additonalDiscount = 0;
                sc.tipAmount = 0;
                sc.showLocationErrorMessage = false;

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

                            $http.jsonp(bingMapApiUrl)
                                .then(function (mapData) {

                                    //  console.log(mapData.data.resourceSets[0].resources[0].address);

                                    var bingMapAddress = mapData.data.resourceSets[0].resources[0].address;

                                    var street = bingMapAddress.addressLine;
                                    street = street.replace(/ /g, '+');
                                    var city = bingMapAddress.locality;
                                    var state = bingMapAddress.adminDistrict;
                                    var zipCode = bingMapAddress.postalCode;
                                    //   console.log(street, city, state, zipCode);
                                    sc.location = city + ', ' + state;

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
                                    sc.manualLocation = false;
                                    sc.tax = tax.data.totalRate;
                                    sc.calculateDiscount();
                                    //console.log(sc.tax);
                                    // console.log(tax.data.totalRate);
                                }, function (err) {
                                    sc.manualLocation = true;
                                    sc.location = '';
                                    console.log('error getting tax: ', err);
                                })

                        }, function (err) {
                            sc.showLocationErrorMessage = true;
                            console.log('ngCordova Location Error: ', err);
                        });

                };

                var getZipAndTax = function () {
                    var avalaraApiKey = 'zSQlGO%2BAPfIeAUvwPV%2Fvw6DVFzV0bZPtla%2FywaQt3Y86r%2BVPoDhVLtNn%2FfAgnbGVmI%2F6FZdzt2edj4mVo%2FLtVQ%3D%3D';
                    var avalaraUrl = 'https://taxrates.api.avalara.com:443/postal?country=usa&postal=' + sc.zipCode + '&apikey=' + avalaraApiKey;
                    $http.get(avalaraUrl)
                        .then(function (tax) {
                            // console.log(tax);
                            sc.manualLocation = false;
                            sc.location = sc.zipCode.toString();
                            sc.tax = tax.data.totalRate;
                            sc.calculateDiscount();
                            var zipCodeApiKey = 'SOHGB1vrpdjLvbjS42ULwhx56SIxg7q9V7Qx9lYzyik3uDVyGPjd7RieK1L18ba4';
                            var requestUrl = 'https://www.zipcodeapi.com/rest/' + zipCodeApiKey + '/info.json/' + sc.location + '/degrees';
                            // console.log(tax.data.totalRate);

                            return $http.get(requestUrl);
                        }, function (err) {
                            sc.manualLocation = true;
                            sc.location = "Invalid Zip Code";
                            console.log('error getting tax: ', err);
                        })
                        .then(function (zipCodeData) {
                            //  console.log(zipCodeData.data);
                            sc.location = zipCodeData.data.city + ', ' + zipCodeData.data.state;
                        }, function (err) {
                            sc.location = "Invalid Zip Code";
                        });
                };

                // Violated apple location guidelines
                // $ionicPlatform.ready(getLocationAndTax); // run once on app load;

                sc.calculateDiscount = function () {
                    // console.log('calculating..');

                    var lastCharacter = '';

                    if (document.querySelector('#price-amount-adv')) {
                        var advVal = document.querySelector('#price-amount-adv').value;
                        var len = advVal.length;
                        var secondLastCharacter = advVal.substr(len - 2, 1);

                        lastCharacter = advVal.substr(len - 1);

                        if (isNaN(lastCharacter)) {

                            if (secondLastCharacter === '+' ||
                                secondLastCharacter === '-' ||
                                secondLastCharacter === '*' ||
                                secondLastCharacter === '/' ||
                                secondLastCharacter === '.') {
                                advVal = advVal.substr(0, len - 1);
                                len = advVal.length;
                            }

                            if (lastCharacter === '+' ||
                                lastCharacter === '-' ||
                                lastCharacter === '*' ||
                                lastCharacter === '/' ||
                                lastCharacter === '.') {
                                console.log('last', advVal.substr(0, len - 1));
                                sc.inputPriceAsIs = advVal.substr(0, len - 1);
                            } else {
                                sc.inputPriceAsIs = advVal.substr(0, len - 1);
                                lastCharacter = '';
                            }


                        } else {
                            lastCharacter = '';
                        }
                    }


                    if (sc.inputPriceAsIs) {

                        if (isNaN(sc.inputPriceAsIs)) {
                            sc.price = eval(sc.inputPriceAsIs);
                            // console.log('inside if', dc.price);
                        } else {

                            sc.price = sc.inputPriceAsIs;
                           // console.log(typeof sc.price);
                            // console.log('inside else', dc.price);
                        }

                        if (!isNaN(sc.price)) {

                            sc.price = Number(sc.price);

                            sc.taxTotal = sc.price * (sc.tax / 100);

                            sc.subtotal = sc.price + sc.taxTotal;

                            sc.tipAmount = sc.tipBeforeTax ? sc.price * (sc.tipPercent / 100) : sc.subtotal * (sc.tipPercent / 100);

                            sc.finalPrice = sc.subtotal + sc.tipAmount;
                        }

                    } else {
                        sc.subtotal = 0;
                        sc.taxTotal = 0;
                        sc.tipAmount = 0;
                        sc.finalPrice = 0;
                    }

                    if (lastCharacter) {
                        sc.inputPriceAsIs = sc.inputPriceAsIs + lastCharacter;
                    }

                    console.log('here');
                };

                var priceAmountInputBox = document.querySelector('#price-amount');
                var priceAmountInputBoxAdv = document.querySelector('#price-amount-adv');


                $ionicGesture.on('touch', function (event) {

                    if (priceAmountInputBox) {
                        if (document.activeElement.id === priceAmountInputBox.id) {
                            // install ionic-plugin-keyboard for this.
                            cordova.plugins.Keyboard.close();
                        }
                    }

                    if (priceAmountInputBoxAdv) {
                        if (document.activeElement.id === priceAmountInputBoxAdv.id) {
                            // install ionic-plugin-keyboard for this.
                            cordova.plugins.Keyboard.close();
                        }
                    }

                }, angular.element(document));

                sc.recalculateTaxByLocationAgain = function () {
                    getLocationAndTax();
                };

                sc.checkTaxInputChange = function () {
                    sc.manualLocation = true;
                    sc.location = '';
                };

                sc.toggleZipCodeLabel = function () {
                    sc.manualLocation = false;
                    sc.showZipCodeInputBox = true;
                };

                sc.getZipAndTax = function () {
                    sc.showZipCodeInputBox = false;
                    getZipAndTax();
                };

                sc.resetLocationErrorMessage = function () {
                    sc.showLocationErrorMessage = false;
                }

            }]);