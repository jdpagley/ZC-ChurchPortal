/**
 * Created by Josh Pagley on 2/27/14.
 */

angular.module('zcApp').factory('zcIdentity', ['$window', function($window) {
    var churchObject;

    if(!!$window.churchObject) {
       churchObject = $window.churchObject;
    }

    return {
        getIdentityObject: function(){
            return churchObject;
        },
        setIdentityObject: function(updatedChurchObject){
            churchObject = updatedChurchObject;
            console.log('updated churchObject in zcIdentity: ');
            console.log(churchObject);
            return churchObject;
        }
    }
}]);