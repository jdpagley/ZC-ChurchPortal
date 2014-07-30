/**
 * Created by Josh Pagley on 5/8/14.
 */
angular.module('zcApp').controller('MemberProfileController', ['$scope', '$routeParams', 'IdentityFactory', 'MembersFactory', 'MessagesFactory',
    function($scope, $routeParams, IdentityFactory, MembersFactory, MessagesFactory){
        $scope.member = null;

        //Retrieve User Profile From Server On Page Refresh
        if(!IdentityFactory.church._id){
            IdentityFactory.getIdentity();
        }

        //Retrieve Member Associated With Member ID In URL Parameters.
        var promise = MembersFactory.retrieveMemberById($routeParams.id);
        promise.then(function(result){
            $scope.member = MembersFactory.member;
        }, function(error){
            console.log(error);
        });

        //Send a message to member
        $scope.sendMessage = function(message){
            if(message){
                var members = [MembersFactory.member._id];
                MessagesFactory.sendMessage(IdentityFactory.admin, members, message);
                $scope.message = "";
            }
        }


    }]);