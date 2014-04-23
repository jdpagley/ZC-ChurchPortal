/**
 * Created by Josh Pagley on 4/23/14.
 */

angular.module('zcApp').controller('SermonHomeController', ['$scope', '$routeParams', 'zcIdentity', 'zcSermons',
    function($scope, $routeParams, zcIdentity, zcSermons){
        //Current User Object
        $scope.currentUser = {};

        //Sermon List
        $scope.sermon = null;

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

        //Retrieve Sermon Associated With Sermon ID In URL Parameters.
        if(!$scope.sermon){;
            var promise;
            promise = zcSermons.retrieveSermonById($routeParams.id);
            promise.then(function(result){
                $scope.sermon = result.sermon;
            }, function(error){
                console.log(error);
            });
        }
    }]);