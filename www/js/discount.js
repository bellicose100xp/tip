/**
 * Created by buggy on 8/27/15.
 */
/**
 * Created by HSO on 7/25/15.
 */
angular.module('starter')
    .controller('discountController', ['$scope', '$ionicGesture', function ($scope, $ionicGesture) {
        var dc = this;

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