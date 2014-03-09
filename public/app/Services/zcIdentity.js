/**
 * Created by Josh Pagley on 2/27/14.
 */

angular.module('zcApp').factory('zcIdentity', ['$window', '$resource', '$q', function($window, $resource, $q) {

    var churchResource = $resource('/api/zionconnect/v1/church/session');

    var churchObject = {};

    return {
        //Function to get the identity information out of zcIdentity.
        getIdentityObject: function(){
            var promise = $q.defer();
            //if churchObject is populated with current account info
            // then return churchObject.
            if(churchObject.email){
                console.log('Returning existing churchObject in zcIdentity');
                promise.resolve(churchObject);
            } else {
                //If churchObject is empty then make call to the
                // server.
                churchResource.get({}, function(result){
                    console.log(result);
                    console.log('Getting church data from the server with session key.');
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
        setIdentityObject: function(updatedChurchObject){
            churchObject = updatedChurchObject;
            console.log('updated zcIdentity with new churchObject: ');
            console.log(churchObject);
            return churchObject;
        }
    }
}]);