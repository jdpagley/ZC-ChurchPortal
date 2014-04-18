/**
 * Created by Josh Pagley on 2/22/14.
 */
/**
 * Zion Connect Portal app.js File.
 * This file sets up the module for the Portal.
*/

var zcApp = angular.module('zcApp', ['ngRoute', 'ngResource']);

zcApp.config(['$routeProvider',
    function($routeProvider){

        $routeProvider.
            when('/feed', {
                templateUrl: 'partials/views/feed',
                controller: 'FeedCtrl'
            }).
            when('/sermons', {
                templateUrl: 'partials/views/sermons',
                controller: 'SermonsCtrl'
            }).
            when('/sermonhome', {
                templateUrl: 'partials/views/sermonHome',
                controller: 'sermonHomeCtrl'
            }).
            when('/sermonaddedit', {
                templateUrl: 'partials/views/sermonAddEdit',
                controller: 'sermonAddEditCtrl'
            }).
            when('/checkins', {
                templateUrl: 'partials/views/checkIns',
                controller: 'chechInsCtrl'
            }).
            when('/members', {
                templateUrl: 'partials/views/members',
                controller: 'membersCtrl'
            }).
            when('/memberprofile', {
                templateUrl: 'partials/views/memberProfile',
                controller: 'memberProfileCtrl'
            }).
            when('/settings', {
                templateUrl: 'partials/views/settings',
                controller: 'SettingsCtrl'
            }).
            otherwise({
                redirectTo: '/feed'
            });
    }])