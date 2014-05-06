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

        //Retrieve Checkins For Checkins Table.
        $scope.showCheckinsErrorMessage = false;
        $scope.checkinsErrorMessage = "";

        $scope.retrieveCheckins = function(service, startDate, endDate){
            var newQueryObj = {}

            if(service && service !== "All" && startDate && endDate){
                //Check service, startDate, and endDate to retrieve checkins based on date range and specific service.
                newQueryObj['endDate'] = new Date(endDate).getTime();
                newQueryObj['startDate'] = new Date(startDate).getTime();
                newQueryObj['service'] = service;
                newQueryObj['church'] = $scope.currentUser._id;

                console.log(newQueryObj);

                var promise;
                promise = zcCheckins.retrieveCheckinsForServiceAndDateRange(newQueryObj);
                promise.then(function(result){
                        console.log(result.checkins);
                        $scope.checkins = result.checkins;
                    },
                    function(error){
                        console.log(error);
                        $scope.showCheckinsErrorMessage = true;
                        $scope.checkinsErrorMessage = error.data.error;
                    });
            } else if (startDate && endDate){
                //Check startDate and endDate to retrieve checkins based on date range.
                newQueryObj['endDate'] = new Date(endDate).getTime();
                newQueryObj['startDate'] = new Date(startDate).getTime();
                newQueryObj['church'] = $scope.currentUser._id;

                console.log(newQueryObj);

                var promise;
                promise = zcCheckins.retrieveCheckinsForDateRange(newQueryObj);
                promise.then(function(result){
                        console.log(result.checkins);
                        $scope.checkins = result.checkins;
                    },
                    function(error){
                        console.log(error);
                        $scope.showCheckinsErrorMessage = true;
                        $scope.checkinsErrorMessage = error.data.error;
                    });
            } else {
                //If service and/or startDate and endDate are not specified throw error.
                console.log('Please specify "Start Date" and "End Date".');
                $scope.showCheckinsErrorMessage = true;
                $scope.checkinsErrorMessage = 'Please specify "Start Date" and "End Date". Thanks!';
            }


        }
    }]);