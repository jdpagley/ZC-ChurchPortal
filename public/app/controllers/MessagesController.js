/**
 * Created by Josh Pagley on 5/28/14.
 */

angular.module('zcApp').controller('MessagesController', ['$scope', 'IdentityFactory', 'MessagesFactory',
    function($scope, IdentityFactory, MessagesFactory){

        var selectedConversation = {};

        /**
         * (1) $scope.conversations is used by the view to display the conversations
         *     inside the conversations list.
         *
         * (2) $scope.retrieveMessagesFailure gets set to true if the server fails
         *     to retrieve conversations from server.
         */
        $scope.conversations = [];
        $scope.retrieveMessagesFailure = false;
        $scope.messageSentFailure = false;


        /**
         * Retrieve admin identity
         *
         * If IdentityFactory.church._id is null then make request
         * to server for admin identity
         */
        if(!IdentityFactory.admin._id){
            /**
             * Retrieve Identity from server and then retrieve conversations.
             */
            var promise = IdentityFactory.getIdentity();
            promise.then(function(){

                /**
                 * Retrieve conversations from MessageFactory.conversations
                 *
                 * (1) If MessageFactory.conversations is empty retrieve from
                 *     conversations from the server and populate $scope.conversations
                 *     with the conversations returned from server.
                 */
                if(IdentityFactory.admin._id && MessagesFactory.conversations.length < 1){
                    var promise = MessagesFactory.getConversations(IdentityFactory.admin._id);
                    promise.then(function(){
                        $scope.conversations = MessagesFactory.conversations;
                    }, function(){
                        $scope.retrieveMessagesFailure = true;
                    });
                }
            }, function(error){});
        } else {
            /**
             * Retrieve conversations from MessageFactory.conversations
             *
             * (1) If MessageFactory.conversations is empty retrieve from
             *     conversations from the server and populate $scope.conversations
             *     with the conversations returned from server.
             *
             * (2) If MessageFactory.conversations is not empty populate
             *     $scope.conversations with the local conversations.
             */
            if(MessagesFactory.conversations.length < 1){
                var promise = MessagesFactory.getConversations(IdentityFactory.admin._id);
                promise.then(function(){
                    $scope.conversations = MessagesFactory.conversations;
                }, function(){
                    $scope.retrieveMessagesFailure = true;
                });
            } else if (MessagesFactory.conversations.length > 0){
                $scope.conversations = MessagesFactory.conversations;
            }
        }

        /**
         * Display conversation selected conversation in main messages section.
         *
         * (1) On conversation box click the index of the conversation the client clicked
         *     is passed into $scope.displayConversation.
         *
         * (2) Retrieve conversation from MessagesFactory.conversations using the index
         *     passed in and add conversation to $scope.selectedConversation.
         */
        $scope.displayConversation = function(index){
            selectedConversation = MessagesFactory.conversations[index];
            selectedConversation['index'] = index;
            $scope.selectedConversation = selectedConversation;
            console.log(selectedConversation);
        }

        /**
         * Delete conversation
         *
         * (1) Use conversation in selectedConversation variable to send to
         *     MessageFactory.deleteConversation function.
         *
         * (2) If conversation successfully deletes display success message.
         *     If there is an error deleting conversation display error message.
         */
        $scope.deleteConversation = function(){
            $scope.deleteConversationConfirmationMessage = false;
            var promise = MessagesFactory.deleteConversation(selectedConversation);
            promise.then(function(){
                selectedConversation = {};
                $scope.selectedConversation = {};
                $scope.deleteConversationSuccessMessage = true;
            }, function(){
                $scope.deleteConversationFailureMessage = true;
            });
        };

        /**
         * Send Message
         *
         * (1) Add members in selected conversation to members array. The members
         *     array will be passed to MessageFactory.sendMessage function.
         *
         * (2) Send the message using the MessageFactory.sendMessage function.
         *     - (Success) Empty members array. Assign empty string to $scope.message.
         *       $scope.message is being bound to by the new message box in the view.
         *     - (Failure) Display error message.
         */
        $scope.sendMessage = function(message){
            if(message){
                var members = [];
                selectedConversation.members.forEach(function(member){
                    members.push(member);
                });

                var promise = MessagesFactory.sendMessage(IdentityFactory.admin, members, message);
                promise.then(function(){
                    members = [];
                    $scope.message = "";
                }, function(){
                    $scope.messageSentFailure = true;
                });
            }
        }

        $scope.deleteMessage = function(index){
            MessagesFactory.deleteMessage(selectedConversation, index);
        }

        //Old code
//        var church = {};
//        var admin = {};
//        var conversations = [];
//        var selectedConversation = {};
//
//        //Retrieve User Profile From Server On Page Refresh
//        if(!church.email){
//            var promise = zcIdentity.getIdentity();
//            promise.then(function(result){
//                church = result.church;
//                admin = result.admin;
//
//                //If conversations are empty then retrieve them from server.
//                if(conversations.length === 0){
//                    var promise = zcMessages.getConversations(admin._id);
//                    promise.then(function(result){
//                        conversations = result;
//                        $scope.conversations = conversations;
//                    });
//                };
//
//            }, function(error){
//                console.log('Error: ' + error);
//            });
//        }
//
//        $scope.displayConversation = function(index){
//            selectedConversation = conversations[index];
//            selectedConversation['index'] = index;
//            $scope.selectedConversation = selectedConversation;
//        }
//
//        $scope.deleteConversation = function(){
//            $scope.deleteConversationConfirmationMessage = false;
//            var promise = zcMessages.deleteConversation(selectedConversation);
//            promise.then(function(result){
//                selectedConversation = {};
//                $scope.selectedConversation = {};
//                $scope.deleteConversationSuccessMessage = true;
//            }, function(error){
//                $scope.deleteConversationFailureMessage = true;
//            });
//        }
//
//        $scope.sendMessage = function(message){
//            if(message && church){
//                var members = [];
//                selectedConversation.members.forEach(function(member){
//                    members.push(member);
//                });
//
//                zcMessages.sendMessage(admin, members, message);
//                $scope.message = "";
//            }
//        }
//
//        $scope.deleteMessage = function(index){
//            zcMessages.deleteMessage(selectedConversation, index);
//        }

    }])