/**
 * Created by Josh Pagley on 3/4/14.
 */

angular.module('zcApp').factory('zcSettings',['$resource', '$q', function($resource, $q) {

    var churchResource = $resource('/church');

    return {
        // churchResource.save(...) makes a POST request back to the server.
        // the post body is specified by the object past to updateChurchSettings.
        updateChurchSettings: function(churchObj){
            var promise = $q.defer();
            churchResource.save(churchObj, function(result){
                promise.resolve(result);
            }, function(error){
                promise.reject(error);
            });

            return promise.promise;
        }
    }


}]);