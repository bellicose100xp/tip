/**
 * Created by HSO on 7/25/15.
 */
angular.module('starter')
    .controller('mainController', ['$scope', '$ionicGesture', function ($scope, $ionicGesture) {
        var mc = this;

        mc.billAmount = '';
        mc.numberOfPeople = 2;
        mc.evenSplit = '';
        mc.tip = 10;
        mc.tipAmount = '';
        mc.splitWithTip = '';
        mc.evenTipSplit = '';
        mc.evenBillSplit = '';

        mc.calculateEvenSplit = function () {

            if (mc.billAmount && mc.numberOfPeople > 0) {
                mc.billAmount = Number(mc.billAmount);
                mc.evenBillSplit = mc.billAmount / mc.numberOfPeople;
                mc.tipAmount = mc.billAmount * (mc.tip / 100);
                mc.evenTipSplit = mc.tipAmount / mc.numberOfPeople;
                mc.evenSplit = (mc.billAmount + mc.tipAmount) / mc.numberOfPeople;
            }

        };

        var billAmountInputBox = document.querySelector('#bill-amount');

        $ionicGesture.on('touch', function (event) {
            if (document.activeElement.id === billAmountInputBox.id) {
                // install ionic-plugin-keyboard for this.
                cordova.plugins.Keyboard.close();
            }
        }, angular.element(document));

    }]);