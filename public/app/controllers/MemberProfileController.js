/**
 * Created by Josh Pagley on 5/8/14.
 */
angular.module('zcApp').controller('MemberProfileController', ['$scope', '$routeParams', 'zcIdentity', 'zcMembers',
    function($scope, $routeParams, zcIdentity, zcMembers){
        //Current User Object
        $scope.currentUser = {};

        //Member Object
        $scope.member = null;

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

        //Retrieve Member Associated With Member ID In URL Parameters.
        if(!$scope.member){
            var promise;
            promise = zcMembers.retrieveMemberById($routeParams.id);
            promise.then(function(result){
                $scope.member = result.member;
            }, function(error){
                console.log(error);
            });
        }


    }]);