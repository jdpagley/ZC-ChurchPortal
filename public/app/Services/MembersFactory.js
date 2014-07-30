/**
 * Created by Josh Pagley on 5/7/14.
 */

angular.module('zcApp').factory('MembersFactory', ['$resource', '$q', function($resource, $q) {

    var retrieveAllMembersResource = $resource('/api/zionconnect/v1/church/members/all');
    var membersResource = $resource('/api/zionconnect/v1/church/members');

    var vm = {};
    vm.members = [];
    vm.member = [];

    /**
     * Retrieve church members from server.
     *
     * @param id - The _id of the church.
     */
    vm.retrieveMembers = function(id){
        var promise = $q.defer();
        retrieveAllMembersResource.get({'id': id}, function(result){
            vm.members = result.members;
            promise.resolve();
        }, function(error){
            promise.reject(error);
        });

        return promise.promise;
    };

    /**
     * Retrieve single member from server.
     *
     * @param id - The _id of the member.
     */
    vm.retrieveMemberById = function(id){
        var promise = $q.defer();
        membersResource.get({'id': id}, function(result){
            vm.member = result.member;
            promise.resolve();
        }, function(error){
            promise.reject(error);
        });

        return promise.promise;
    };

    return vm;
}]);