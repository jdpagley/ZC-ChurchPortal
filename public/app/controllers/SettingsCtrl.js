/**
 * Created by Josh Pagley on 3/3/14.
 */
/**
 This is the Settings Controller. This controller will handle changing (updating)
 church profile information for the church.
 */

angular.module('zcApp').controller('SettingsCtrl', ['zcIdentity', 'zcSettings', '$scope', '$location',
    function(zcIdentity, zcSettings, $scope, $location){

        //Current User Object
        $scope.currentUser = {};

        var defer;
        if(!$scope.currentUser.email){
            defer = zcIdentity.getIdentityObject();
            defer.then(function(result){
                $scope.currentUser = result;
            }, function(error){
                console.log('Error: ' + error);
            });
        }

        // Update User Settings =======================================================
        //All Setting form fields are binding to this object.
        //Object contains email and password by default so that
        //it will be able to be authorized on the server.
        $scope.updateObject = {
            email: $scope.currentUser.email,
            password: $scope.currentUser.password
        };

        //Booleans to see if update was successful or failed.
        $scope.updateSuccess = false;
        $scope.updateFailure = false;

        //Function that gets called whenever user hits update church
        //settings button.
        $scope.updateChurch = function(){
            //returns promise object to $scope.church.
            $scope.church = zcSettings.updateChurchSettings($scope.updateObject);

            //Promise functions. First function is success, Second function is failure.
            $scope.church.then(
                function(churchObject){
                    console.log('Update Successful. New churchObject: ');
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

        // Reset Church Password =======================================================
        $scope.resetConfirmationMessage = false;
        $scope.passwordMatchError = false;
        $scope.resetSuccess = false;

        $scope.resetPassword = function(){
            if($scope.newPassword == $scope.newPasswordRetyped && $scope.newPassword != "" && $scope.newPasswordRetyped != ""){
                $scope.passwordMatchError = false;

                var defer = zcSettings.resetPassword({
                    email: $scope.currentUser.email,
                    password: $scope.currentUser.password,
                    newPassword: $scope.newPassword});

                defer.then(
                    function(result){
                        console.log(result);
                        $scope.resetSuccess = true;
                    }, function(error){
                        console.log(error);
                    });

            } else {
                $scope.passwordMatchError = true;
            }
        }

        // Delete Church Account ==========================================================
        $scope.deletionConfirmationMessage = false;

        $scope.deleteAccount = function(){
            console.log('DeleteAccount function called and current user email is: ');
            console.log($scope.currentUser.email);
            zcSettings.deleteChurch({email: $scope.currentUser.email});
        }
    }]);