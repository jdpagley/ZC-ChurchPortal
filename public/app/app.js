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
                controller: 'FeedController'
            }).
            when('/sermons', {
                templateUrl: 'partials/views/sermons',
                controller: 'SermonsController'
            }).
            when('/sermonhome', {
                templateUrl: 'partials/views/sermonHome',
                controller: 'SermonHomeController'
            }).
            when('/settings', {
                templateUrl: 'partials/views/settings',
                controller: 'SettingsController'
            }).
            otherwise({
                redirectTo: '/feed'
            });
    }])