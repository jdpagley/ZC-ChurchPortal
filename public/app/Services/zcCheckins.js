/**
 * Created by Josh Pagley on 5/2/14.
 */

angular.module('zcApp').factory('zcCheckins',['$resource', '$q', function($resource, $q) {

    var checkinsServiceResource = $resource('/api/zionconnect/v1/church/checkins/service');
    var checkinsResource = $resource('/api/zionconnect/v1/church/checkins');

    return {
        retrieveCheckinsForServiceAndDateRange: function(queryObj){
            var promise = $q.defer();
            checkinsServiceResource.get(queryObj, function(result){
                promise.resolve(result);
            }, function(error){
                promise.reject(error);
            });

            return promise.promise;
        },
        retrieveCheckinsForDateRange: function(queryObj){
            var promise = $q.defer();
            checkinsResource.get(queryObj, function(result){
                promise.resolve(result);
            }, function(error){
                promise.reject(error);
            });

            return promise.promise;
        }
    }

}]);