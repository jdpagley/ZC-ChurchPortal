/**
 * Created by Josh Pagley on 2/27/14.
 */

angular.module('zcApp').factory('zcIdentity', ['$window', '$resource', '$q', function($window, $resource, $q) {

    var churchResource = $resource('/api/zionconnect/v1/church/session');

    var churchObject = {};

    return {
        getIdentity: function(){
            var promise = $q.defer();
            // If churchObject is populated with current account info
            // then return churchObject.
            if(churchObject.email){
                console.log('Returning existing churchObject in zcIdentity');
                promise.resolve(churchObject);
            } else {
                //If churchObject is empty then make call to the server.
                churchResource.get({}, function(result){
                    console.log('Getting church data from the server with session key.');
                    console.log(result);
                    churchObject = result.church;
                    promise.resolve(result.church);
                }, function(error){
                    console.log(error);
                    promise.reject(error);
                });
            }

            return promise.promise;
        },
        //Set the churchObject with the new updated churchObject to make
        //it available to rest of the app.
        setIdentity: function(updatedChurchObject){
            churchObject = updatedChurchObject;
            return churchObject;
        }
    }
}]);