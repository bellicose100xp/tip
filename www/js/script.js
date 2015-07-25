/**
 * Created by HSO on 7/25/15.
 */
angular.module('starter')
.controller('mainController', [function () {
        var mc = this;

        mc.billAmount = '';
        mc.numberOfPeople = 2;
        mc.evenSplit = '';

        mc.calculateEvenSplit = function () {

            if(mc.billAmount && mc.numberOfPeople > 0)

            {
                mc.evenSplit = mc.billAmount / mc.numberOfPeople;
            }

        }

    }]);