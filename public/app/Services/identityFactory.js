/**
 * Created by Josh Pagley on 2/27/14.
 */

angular.module('zcApp').factory('identityFactory', ['$window', '$resource', '$q', function($window, $resource, $q) {

    var churchResource = $resource('/api/zionconnect/v1/church/session');

    var church = {};
    var admin = {};

    function getIdentity(){

    }

    return {
        getIdentity: function(){
            // If churchObject is populated with current account info
            // then return churchObject.
            var promise = $q.defer();
            if(admin._id){
                console.log('Returning existing churchObject in zcIdentity');
                promise.resolve({ admin: admin, church: church});
            } else {
                //If churchObject is empty then make call to the server.
                churchResource.get({}, function(result){
                    church = result.church;
                    admin = result.admin;
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
            church = updatedChurchObject;
            return church;
        },
        getChurch: function(){
            if(church._id){
                return church;
            }

        },
        setAdmin: function(newAdmin){
            admin = newAdmin;
            return admin;
        },
        getAdmin: function(){
            return admin;
        }
    }
}]);