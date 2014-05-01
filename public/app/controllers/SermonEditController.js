/**
 * Created by Josh Pagley on 4/24/14.
 */
angular.module('zcApp').controller('SermonEditController', ['$scope', '$routeParams', 'zcIdentity', 'zcSermons',
    function($scope, $routeParams, zcIdentity, zcSermons){
        //Current User Object
        $scope.currentUser = {};

        //Sermon Object
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
        if(!$scope.sermon){
            var promise;
            promise = zcSermons.retrieveSermonById($routeParams.id);
            promise.then(function(result){
                $scope.sermonObject = result.sermon;
                $scope.sermon = result.sermon;
            }, function(error){
                console.log(error);
            });
        }

        //Update Sermon
        $scope.sermonObject = {};
        $scope.sermonCreatedSuccessfully = false;
        $scope.sermonCreationFailure = false;

        $scope.updateSermon = function(){

            var promise = zcSermons.updateSermon($scope.sermonObject);
            promise.then(function(result){
                if(result.sermon){
                    $scope.sermonCreatedSuccessfully = true;
                    $scope.sermonObject = result.sermon;
                }
            }, function(error){
                console.log(error);
                $scope.sermonCreationFailure = true;
            });
        }
    }]);