/**
 * Created by Josh Pagley on 5/28/14.
 */

angular.module('zcApp').controller('MessagesController', ['$scope', 'zcIdentity', 'zcMessages',
    function($scope, zcIdentity, zcMessages){

        var church = {};
        var admin = {};
        var conversations = [];
        var selectedConversation = {};

        //Retrieve User Profile From Server On Page Refresh
        if(!church.email){
            var promise = zcIdentity.getIdentity();
            promise.then(function(result){
                church = result.church;
                admin = result.admin;

                //If conversations are empty then retrieve them from server.
                if(conversations.length === 0){
                    var promise = zcMessages.getConversations(admin._id);
                    promise.then(function(result){
                        conversations = result;
                        $scope.conversations = conversations;
                    });
                };

            }, function(error){
                console.log('Error: ' + error);
            });
        }

        $scope.displayConversation = function(index){
            selectedConversation = conversations[index];
            selectedConversation['index'] = index;
            $scope.selectedConversation = selectedConversation;
        }

        $scope.deleteConversation = function(){
            $scope.deleteConversationConfirmationMessage = false;
            var promise = zcMessages.deleteConversation(selectedConversation);
            promise.then(function(result){
                selectedConversation = {};
                $scope.selectedConversation = {};
                $scope.deleteConversationSuccessMessage = true;
            }, function(error){
                $scope.deleteConversationFailureMessage = true;
            });
        }

        $scope.sendMessage = function(message){
            if(message && church){
                var members = [];
                selectedConversation.members.forEach(function(member){
                    members.push(member);
                });

                zcMessages.sendMessage(admin, members, message);
                $scope.message = "";
            }
        }

        $scope.deleteMessage = function(index){
            zcMessages.deleteMessage(selectedConversation, index);
        }

    }])