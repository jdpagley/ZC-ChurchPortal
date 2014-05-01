/**
 * Created by Josh Pagley on 2/25/14.
 */

angular.module('zcApp').controller('SermonsController', ['$scope', 'zcIdentity', 'zcSermons',
    function($scope, zcIdentity, zcSermons){
        //Current User Object
        $scope.currentUser = {};

        //Sermon List
        $scope.sermons = [];

        //Retrieve User Profile From Server On Page Refresh
        if(!$scope.currentUser.email){
            var promise;
            promise = zcIdentity.getIdentity();
            promise.then(function(result){
                $scope.currentUser = result;

                //Retrieve Posts Associated With Current User ID.
                if($scope.currentUser._id && $scope.sermons.length < 1){;
                    var promise;
                    promise = zcSermons.retrieveSermons($scope.currentUser._id);
                    promise.then(function(result){
                        $scope.sermons = result.sermons;
                        console.log(result);
                    }, function(error){
                        console.log('Error: ' + error);
                    });
                }

            }, function(error){
                console.log('Error: ' + error);
            });
        }

    }]);