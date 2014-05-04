/**
 * Created by Josh Pagley on 5/2/14.
 */

angular.module('zcApp').controller('CheckinsController', ['$scope', 'zcIdentity', 'zcCheckins',
    function($scope, zcIdentity, zcCheckins){
        //Current User Object
        $scope.currentUser = {};

        //Checkins
        $scope.checkins = [];

        //Retrieve User Profile From Server On Page Refresh
        if(!$scope.currentUser.email){
            var promise;
            promise = zcIdentity.getIdentity();
            promise.then(function(result){
                $scope.currentUser = result;
            }, function(error){
                console.log(error);
            });
        }

        $scope.retrieveCheckins = function(service){
            var newQueryObj = {}

            newQueryObj['endDate'] = new Date().getTime();
            newQueryObj['startDate'] = new Date().getTime() - 604800000;
            newQueryObj['service'] = service;
            newQueryObj['church'] = $scope.currentUser._id;

            console.log(newQueryObj);

            var promise;
            promise = zcCheckins.retrieveCheckins(newQueryObj);
            promise.then(function(result){
                    console.log(result.checkins);
                    $scope.checkins = result.checkins;
                },
                function(error){
                    console.log(error);
                });
        }
    }]);