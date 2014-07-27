/**
 * Created by Josh Pagley on 5/7/14.
 */

angular.module('zcApp').controller('MembersController', ['$scope', 'IdentityFactory', 'MembersFactory',
    function($scope, IdentityFactory, MembersFactory){

        $scope.members = [];

        if(!IdentityFactory.church._id){
            /**
             * Retrieve Identity from server and then retrieve members.
             */
            var promise = IdentityFactory.getIdentity();
            promise.then(function(){
                var promise = MembersFactory.retrieveMembers(IdentityFactory.church._id);
                promise.then(function(){
                    $scope.members = MembersFactory.members;
                }, function(error){})
            }, function(error){});
        } else {
            /**
             * Retrieve Members With Church _id
             */
            if(MembersFactory.members.length < 1){
                var promise = MembersFactory.retrieveMembers(IdentityFactory.church._id);
                promise.then(function(){
                    $scope.members = MembersFactory.members;
                }, function(error){})
            } else if (MembersFactory.members.length > 0){
                $scope.members = MembersFactory.members;
            }
        }

        //Old code============================
//        //Sermon List
//        $scope.members = [];
//
//        //Current User Object
//        //$scope.currentUser = {};
//        var admin = {};
//        var church = {};
//
//        //Retrieve Current User Object From Server
//        if(!admin.email){
//            var promise = zcIdentity.getIdentity();
//            promise.then(function(result){
//                //set admin and church objects with accounts returned from server.
//                admin = result.admin;
//                church = result.church;
//
//                //Retrieve Members that have a membership ID associated with this church ID.
//                if(church._id && $scope.members.length < 1){
//                    var promise;
//                    promise = zcMembers.retrieveMembers(church._id);
//                    promise.then(function(result){
//                        $scope.members = result.members;
//                        console.log(result);
//                    }, function(error){
//                        console.log('Error: ' + error);
//                    });
//                }
//
//            }, function(error){
//                console.log('Error: ' + error);
//            });
//        }

    }]);