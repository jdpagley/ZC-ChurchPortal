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
            defer = zcIdentity.getIdentity();
            defer.then(function(result){
                $scope.currentUser = result;
            }, function(error){
                console.log('Error: ' + error);
            });
        }

        // Update User Settings =======================================================

        //Booleans to see if update was successful or failed.
        $scope.updateSuccess = false;
        $scope.updateFailure = false;

        //Settings form fields are binding ot updateObject.
        $scope.updateObject = {};

        //Function that gets called whenever user hits update church
        //settings button.
        $scope.updateChurch = function(){

            $scope.updateObject.email = $scope.currentUser.email;
            $scope.updateObject.password = $scope.currentUser.password;

            console.log($scope.updateObject);
            var promise = zcSettings.updateChurch($scope.updateObject);

            //Promise functions. First function is success, Second function is failure.
            promise.then(
                function(churchObject){
                    console.log('Update Successful. New churchObject: ');
                    console.log(churchObject.church);

                    //Set identity with updated churchObject.
                    zcIdentity.setIdentity(churchObject.church);

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

        // Add/Update/Remove Church Services =================================================

        //The serviceObject is bond to the view and will be pushed onto $scope.currentUser.services
        //when user adds new service. currentUser.services will be sent to the service to update services.
        $scope.serviceObject = {};

        $scope.updateChurchServices = function(){
            $scope.currentUser.services.push($scope.serviceObject);
            console.log('$scope.currentUser.services: ');
            console.log($scope.currentUser.services);

            //Reset serviceObject so that Angular doesn't bind to
            //service in the list.
            $scope.serviceObject = {};

            var promise = zcSettings.updateChurchServices($scope.currentUser.email, $scope.currentUser.services);
            promise.then(function(result){
                console.log(result);
            }, function(error){
                console.log(error);
            });
        }

        $scope.removeChurchService = function(index){

            $scope.currentUser.services.splice(index, 1);

            var servicesObject = [];
            for(var i = 0; i < $scope.currentUser.services.length; i++){
                if($scope.currentUser.services[i].day){
                   servicesObject.push($scope.currentUser.services[i]);
                }
            }

            $scope.currentUser.services = servicesObject;

            console.log('$scope.currentUser services: ');
            console.log($scope.currentUser.services);

            zcSettings.updateChurchServices($scope.currentUser.email, $scope.currentUser.services);
        }

        // Reset Church Password =======================================================
        $scope.resetConfirmationMessage = false;
        $scope.passwordMatchError = false;
        $scope.resetSuccess = false;

        $scope.resetPassword = function(){
            if($scope.newPassword == $scope.newPasswordRetyped && $scope.newPassword != "" && $scope.newPasswordRetyped != ""){
                $scope.passwordMatchError = false;

                var promise = zcSettings.resetPassword({
                    email: $scope.currentUser.email,
                    password: $scope.currentUser.password,
                    newPassword: $scope.newPassword});

                promise.then(
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