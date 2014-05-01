/**
 * Created by Josh Pagley on 4/19/14.
 */

angular.module('zcApp').controller('SermonAddController', ['$scope', 'zcIdentity', 'zcSermons',
    function($scope, zcIdentity, zcSermons){
        //Current User Object
        $scope.currentUser = {};

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

        //Create New Sermon
        $scope.sermonObject = {};
        $scope.sermonCreatedSuccessfully = false;
        $scope.sermonCreationFailure = false;

        $scope.createSermon = function(){
            $scope.sermonObject['owner'] = $scope.currentUser._id;

            var promise = zcSermons.createSermon($scope.sermonObject);
            promise.then(function(result){
                if(result.sermon){
                    $scope.sermonCreatedSuccessfully = true;
                    zcSermons.addSermonToLocalSermonList(result.sermon);
                    $scope.sermonObject = {};
                }
            }, function(error){
                console.log('Error: ' + error);
                $scope.sermonCreationFailure = true;
            });
        }



    }])