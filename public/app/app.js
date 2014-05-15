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
            when('/sermons/:id', {
                templateUrl: 'partials/views/sermonHome',
                controller: 'SermonHomeController'
            }).
            when('/sermon/add', {
                templateUrl: 'partials/views/sermonAdd',
                controller: 'SermonAddController'
            }).
            when('/sermon/edit/:id', {
                templateUrl: 'partials/views/sermonEdit',
                controller: 'SermonEditController'
            }).
            when('/checkins', {
                templateUrl: 'partials/views/checkIns',
                controller: 'CheckinsController'
            }).
            when('/members', {
                templateUrl: 'partials/views/members',
                controller: 'MembersController'
            }).
            when('/member/profile', {
                templateUrl: 'partials/views/memberProfile',
                controller: 'MemberProfileController'
            }).
            when('/settings', {
                templateUrl: 'partials/views/settings',
                controller: 'SettingsController'
            }).
            when('/messages', {
                templateUrl: 'partials/views/messages',
                controller: 'MessagesController'
            }).
            otherwise({
                redirectTo: '/feed'
            });
    }])