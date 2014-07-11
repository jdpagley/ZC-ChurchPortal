/**
 * Created by Josh Pagley on 2/27/14.
 */

angular.module('zcApp').factory('IdentityFactory', ['$resource', '$q', function IdentityFactory($resource, $q) {

    var churchResource = $resource('/api/zionconnect/v1/church/session');

    var vm = {};

    vm.church = {};
    vm.admin = {};

    vm.getIdentity = function(){
        var promise = $q.defer();
        if(vm.admin._id){
            promise.resolve();
        } else {
            churchResource.get({}, function(result){
                vm.church = result.church;
                vm.admin = result.admin;
                promise.resolve();
            }, function(error){
                //Todo: Create an error handling factory for IdentityFactory Errors.
                console.log(error);
                promise.reject();
            });
        }
        return promise.promise;
    };

    return vm;
}]);