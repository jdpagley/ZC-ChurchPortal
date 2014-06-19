/**
 * Created by Josh Pagley on 2/27/14.
 */

angular.module('zcApp').factory('zcIdentity', ['$window', '$resource', '$q', function($window, $resource, $q) {

    var churchResource = $resource('/api/zionconnect/v1/church/session');

    var churchObject = {};
    var adminObject = {};

    return {
        getIdentity: function(){
            var promise = $q.defer();
            // If churchObject is populated with current account info
            // then return churchObject.
            if(adminObject._id){
                console.log('Returning existing churchObject in zcIdentity');
                promise.resolve({ admin: adminObject, church: churchObject});
            } else {
                //If churchObject is empty then make call to the server.
                churchResource.get({}, function(result){
                    console.log('Getting church data from the server with session key.');
                    console.log(result);
                    churchObject = result.church;
                    adminObject = result.admin;
                    promise.resolve(result);
                }, function(error){
                    console.log(error);
                    promise.reject(error);
                });
            }

            return promise.promise;
        },
        //Set the churchObject with the new updated churchObject to make
        //it available to rest of the app.
        setChurch: function(updatedChurchObject){
            churchObject = updatedChurchObject;
            return churchObject;
        },
        getChurch: function(){
            return churchObject;
        },
        setAdmin: function(newAdmin){
            adminObject = newAdmin;
            return adminObject;
        },
        getAdmin: function(){
            return adminObject;
        }
    }
}]);