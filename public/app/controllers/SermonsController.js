/**
 * Created by Josh Pagley on 2/25/14.
 */

angular.module('zcApp').controller('SermonsController', ['$scope', 'IdentityFactory', 'SermonsFactory',
    function($scope, IdentityFactory, SermonsFactory){

        $scope.sermons = [];

        if(!IdentityFactory.admin._id){
            var promise = IdentityFactory.getIdentity();
            promise.then(function(){
                if(SermonsFactory.sermons.length > 0){
                    $scope.sermons = SermonsFactory.sermons;
                } else {
                    var promise = SermonsFactory.retrieveSermons(IdentityFactory.church._id);
                    promise.then(function(){
                        $scope.sermons = SermonsFactory.sermons;
                    }, function(){});
                }
            }, function(error){});
        } else {
            if(SermonsFactory.sermons.length > 0){
                $scope.sermons = SermonsFactory.sermons;
            } else {
                var promise = SermonsFactory.retrieveSermons(IdentityFactory.church._id);
                promise.then(function(){
                    $scope.sermons = SermonsFactory.sermons;
                }, function(){});
            }
        }

        //Old Code===================================

//        //Sermon List
//        $scope.sermons = [];
//
//        //Current User Object
//        var admin = {};
//        var church = {};
//
//        //Retrieve Admin User and Church Object From Server
//        if(!admin.email){
//            var promise = zcIdentity.getIdentity();
//            promise.then(function(result){
//                //set admin and church objects with accounts returned from server.
//                admin = result.admin;
//                church = result.church;
//
//                //Retrieve Sermons Associated With Current User ID.
//                if(church._id && $scope.sermons.length < 1){;
//                    var promise;
//                    promise = zcSermons.retrieveSermons(church._id);
//                    promise.then(function(result){
//                        $scope.sermons = result.sermons;
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