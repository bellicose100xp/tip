/**
 * Created by HSO on 7/25/15.
 */
angular.module('starter')
    .controller('mainController', [function () {
        var mc = this;

        mc.billAmount = '';
        mc.numberOfPeople = 2;
        mc.evenSplit = '';
        mc.tip = 10;
        mc.tipAmount = '';
        mc.splitWithTip = '';

        mc.calculateEvenSplit = function () {

            if (mc.billAmount && mc.numberOfPeople > 0) {
                mc.tipAmount = mc.billAmount * (mc.tip / 100);
                mc.evenSplit = (mc.billAmount + mc.tipAmount) / mc.numberOfPeople;
            }

        }

    }]);