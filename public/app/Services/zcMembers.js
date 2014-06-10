/**
 * Created by Josh Pagley on 5/7/14.
 */

angular.module('zcApp').factory('zcMembers', ['$resource', '$q', function($resource, $q) {

    var retrieveAllMembersResource = $resource('/api/zionconnect/v1/church/members/all');
    var membersResource = $resource('/api/zionconnect/v1/church/members');

    return {
        retrieveMembers: function(churchID){
            console.log('retrieving posts from server.')
            var promise = $q.defer();
            retrieveAllMembersResource.get({'id': churchID}, function(result){
                promise.resolve(result);
            }, function(error){
                promise.reject(error);
            });

            return promise.promise;
        },
        retrieveMemberById: function(memberID){
            var promise = $q.defer();
            membersResource.get({'id': memberID}, function(result){
                promise.resolve(result);
            }, function(error){
                promise.reject(error);
            });

            return promise.promise;
        }
    }
}]);