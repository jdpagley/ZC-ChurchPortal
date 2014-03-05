/**
 * Created by Josh Pagley on 3/3/14.
 */
/**
 This is the Settings Controller. This controller will handle changing (updating)
 church profile information for the church.
 */

angular.module('zcApp').controller('SettingsCtrl', ['$scope', 'zcIdentity', 'zcSettings',
    function($scope, zcIdentity, zcSettings){

        //Retrieving current churchObject form zcIdentity
        $scope.currentUser = zcIdentity.getIdentityObject();
        console.log($scope.currentUser);

        //All Setting form fields are binding to this object.
        //Object contains email and password by default so that
        // it will be able to authorized on the server.
        $scope.updateObject = {
            email: $scope.currentUser.email,
            password: $scope.currentUser.password
        };

        //Booleans to see if update was successful or failed.
        $scope.updateSuccess = false;
        $scope.updateFailure = false;

        //Function that gets called whenever user hits update church
        //settings button.

        $scope.updateChurch= function(){
            //returns promise object to $scope.church.
            $scope.church = zcSettings.updateChurchSettings($scope.updateObject);

            //Promise functions. First function is success, Second function is failure.
            $scope.church.then(
                function(churchObject){
                    console.log('Update Successful. New churchObject: ')
                    console.log(churchObject.church);
                    //Updating church identity object with updated churchObj
                    //that is returned by the server.
                    zcIdentity.setIdentityObject(churchObject.church);

                    //Sets the currentUser for this controller to the new
                    //updated churchObj that got returned by the server.
                    $scope.currentUser = churchObject.church;

                    //Update was successful.
                    $scope.updateSuccess = true;
                    $scope.updateFailure = false;
                },
                function(result){
                    console.log('Update failed.');
                    console.log(result);
                    //Update failed.
                    $scope.updateSuccess = false;
                    $scope.updateFailure = true;
                });
        }
    }]);