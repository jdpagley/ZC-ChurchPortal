/**
 * Created by Josh Pagley on 5/8/14.
 */
angular.module('zcApp').controller('MemberProfileController', ['$scope', '$routeParams', 'IdentityFactory', 'MembersFactory', 'MessagesFactory',
    function($scope, $routeParams, IdentityFactory, MembersFactory, MessagesFactory){
        $scope.member = null;
        $scope.messageSentSuccessfully = false;
        $scope.messageSentFailure = false;

        /**
         * Retrieve church admin profile on page refresh.
         */
        if(!IdentityFactory.church._id){
            IdentityFactory.getIdentity();
        }

        /**
         * Retrieve member associated with member ID in URL parameters.
         */
        var promise = MembersFactory.retrieveMemberById($routeParams.id);
        promise.then(function(result){
            $scope.member = MembersFactory.member;
        }, function(error){
            console.log(error);
        });

        /**
         * Send message to member.
         *
         * @param message - message text.
         */
        $scope.sendMessage = function(message){
            if(message){
                var members = [MembersFactory.member._id];

                var promise = MessagesFactory.sendMessage(IdentityFactory.admin, members, message);
                promise.then(function(){
                    $scope.messageSentSuccessfully = true;
                }, function(){
                    $scope.messageSentFailure = false;
                });

                $scope.message = "";
            }
        }


    }]);