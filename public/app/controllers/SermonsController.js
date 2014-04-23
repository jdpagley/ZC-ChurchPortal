/**
 * Created by Josh Pagley on 2/25/14.
 */

angular.module('zcApp').controller('SermonsController', ['$scope', 'zcIdentity', 'zcSermons',
    function($scope, zcIdentity, zcSermons){
        //Current User Object
        $scope.currentUser = {};

        //Sermon List
        $scope.sermons = {};

        //Retrieve User Profile From Server On Page Refresh
        if(!$scope.currentUser.email){
            var promise;
            promise = zcIdentity.getIdentity();
            promise.then(function(result){
                $scope.currentUser = result;
            }, function(error){
                console.log('Error: ' + error);
            });
        }

        //Retrieve List Of Sermons

    }]);