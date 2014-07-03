/**
 * Created by Josh Pagley on 5/7/14.
 */

angular.module('zcApp').controller('MembersController', ['$scope', 'zcIdentity', 'zcMembers',
    function($scope, zcIdentity, zcMembers){

        //Sermon List
        $scope.members = [];

        //Current User Object
        //$scope.currentUser = {};
        var admin = {};
        var church = {};

        //Retrieve Current User Object From Server
        if(!admin.email){
            var promise = zcIdentity.getIdentity();
            promise.then(function(result){
                //set admin and church objects with accounts returned from server.
                admin = result.admin;
                church = result.church;

                //Retrieve Members that have a membership ID associated with this church ID.
                if(church._id && $scope.members.length < 1){
                    var promise;
                    promise = zcMembers.retrieveMembers(church._id);
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