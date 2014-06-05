/**
 * Created by Josh Pagley on 5/7/14.
 */

angular.module('zcApp').controller('MembersController', ['$scope', 'zcIdentity', 'zcMembers',
    function($scope, zcIdentity, zcMembers){
        //Current User Object
        $scope.currentUser = {};

        //Sermon List
        $scope.members = [];

        //Retrieve User Profile From Server On Page Refresh
        if(!$scope.currentUser.email){
            var promise;
            promise = zcIdentity.getIdentity();
            promise.then(function(result){
                $scope.currentUser = result;

                //Retrieve Members that have a membership ID associated with this church ID.
                if($scope.currentUser._id && $scope.members.length < 1){;
                    var promise;
                    promise = zcMembers.retrieveMembers($scope.currentUser._id);
                    promise.then(function(result){
                        $scope.members = result.members;
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