/**
 * Created by Josh Pagley on 5/12/14.
 */

angular.module('zcApp').factory('zcNotifications',['$resource', '$q', function($resource, $q) {

    var notificationsResource = $resource('/api/zionconnect/v1/church/notifications');

    return {
        createNotification: function(notificationObj){
            var promise = $q.defer();
            notificationsResource.save(notificationObj, function(result){
                promise.resolve(result);
            }, function(error){
                promise.reject(error);
            });

            return promise.promise;
        }
    }

}]);