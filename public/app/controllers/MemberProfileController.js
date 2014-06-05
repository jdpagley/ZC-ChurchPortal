/**
 * Created by Josh Pagley on 5/8/14.
 */
angular.module('zcApp').controller('MemberProfileController', ['$scope', '$routeParams', 'zcIdentity', 'zcMembers', 'zcMessages',
    function($scope, $routeParams, zcIdentity, zcMembers, zcMessages){
        //Current User Object
        var church = {};

        //Member Object
        var member = null;
        $scope.member = null;

        //Retrieve User Profile From Server On Page Refresh
        if(!church.email){
            var promise;
            promise = zcIdentity.getIdentity();
            promise.then(function(result){
                church = result;
            }, function(error){
                console.log(error);
            });
        }

        //Retrieve Member Associated With Member ID In URL Parameters.
        if(!$scope.member){
            var promise;
            promise = zcMembers.retrieveMemberById($routeParams.id);
            promise.then(function(result){
                member = result.member;
                $scope.member = result.member;
            }, function(error){
                console.log(error);
            });
        }

        //Send a message to member
        $scope.sendMessage = function(message){
            if(message){
                var members = [member._id];
                zcMessages.sendMessage(church, members, message);
                $scope.message = "";
            }
        }


    }]);