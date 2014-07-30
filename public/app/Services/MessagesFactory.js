/**
 * Created by Josh Pagley on 5/28/14.
 */

angular.module('zcApp').factory('MessagesFactory', ['$resource', '$q', 'IdentityFactory', function($resource, $q, IdentityFactory) {

    var conversationsResource = $resource('/api/zionconnect/v1/church/conversation');
    var messagesResource = $resource('/api/zionconnect/v1/church/messages');

//    var socket = io.connect('http://localhost:3000');
//    socket.on('message', function(data){
//        console.log(data);
//    });

    var vm = {};
    vm.conversations = [];

   /* var testConversations = [{
        _id: 1,
        owner: 12345,
        members: [{'name': 'jeremy Pagley', '_id': 1234}],
        createdAt: new Date('5/4/2014'),
        updatedAt: new Date('5/4/2014'),
        messages: [{
            _id: 1,
            sender_name: 'Hope Church',
            sender_type: 'church',
            sender_church: 12345,
            message: 'Hi jeremy, I just wanted to say thanks for your help tonight with the tech. It was a pleasure having your there.',
            createdAt: new Date('5/1/2014')
        },{
            _id: 2,
            sender_name: 'Jeremy Pagley',
            sender_type: 'member',
            sender_church: 12345,
            message: 'It was fun. Im glad you asked me to come and help!',
            createdAt: new Date('5/1/2014')
        },{
            _id: 3,
            sender_name: 'Hope Church',
            sender_type: 'church',
            sender_church: 12345,
            message: 'Hi jeremy, I just wanted to say thanks for your help tonight with the tech. It was a pleasure having your there.' +
                'Hi jeremy, I just wanted to say thanks for your help tonight with the tech. It was a pleasure having your there.' +
                'Hi jeremy, I just wanted to say thanks for your help tonight with the tech. It was a pleasure having your there.' +
                'Hi jeremy, I just wanted to say thanks for your help tonight with the tech. It was a pleasure having your there.' +
                'Hi jeremy, I just wanted to say thanks for your help tonight with the tech. It was a pleasure having your there.',
            createdAt: new Date('5/4/2014')
        },{
            _id: 4,
            sender_name: 'Jeremy Pagley',
            sender_type: 'member',
            sender_church: 12345,
            message: 'Just let me know if your guys are ever short some again. I would be more than happy to help out.',
            createdAt: new Date('5/5/2014')
        },{
            _id: 5,
            sender_name: 'Hope Church',
            sender_type: 'church',
            sender_church: 12345,
            message: 'Thanks! We really appreciate it so much.',
            createdAt: new Date('5/10/2014')
        },{
            _id: 6,
            sender_name: 'Hope Church',
            sender_type: 'church',
            sender_church: 12345,
            message: 'Hi jeremy, I just wanted to say thanks for your help tonight with the tech. It was a pleasure having your there.' +
                'Hi jeremy, I just wanted to say thanks for your help tonight with the tech. It was a pleasure having your there.' +
                'Hi jeremy, I just wanted to say thanks for your help tonight with the tech. It was a pleasure having your there.' +
                'Hi jeremy, I just wanted to say thanks for your help tonight with the tech. It was a pleasure having your there.' +
                'Hi jeremy, I just wanted to say thanks for your help tonight with the tech. It was a pleasure having your there.',
            createdAt: new Date('5/12/2014')
        },{
            _id: 7,
            sender_name: 'Hope Church',
            sender_type: 'church',
            sender_church: 12345,
            message: 'Hi jeremy, I just wanted to say thanks for your help tonight with the tech. It was a pleasure having your there.' +
                'Hi jeremy, I just wanted to say thanks for your help tonight with the tech. It was a pleasure having your there.' +
                'Hi jeremy, I just wanted to say thanks for your help tonight with the tech. It was a pleasure having your there.' +
                'Hi jeremy, I just wanted to say thanks for your help tonight with the tech. It was a pleasure having your there.' +
                'Hi jeremy, I just wanted to say thanks for your help tonight with the tech. It was a pleasure having your there.',
            createdAt: new Date('5/14/2014')
        }]
    },{
        _id: 2,
        owner: 12345,
        members: [{'name': 'Josh Pagley', '_id': 5678}],
        createdAt: new Date('5/10/2014'),
        updatedAt: new Date('5/10/2014'),
        messages: [{
            _id: 1,
            sender_name: 'Hope Church',
            sender_type: 'church',
            sender_church: 12345,
            message: 'Hi josh, I just wanted to say thanks for your help tonight with the tech. It was a pleasure having your there.',
            createdAt: new Date('5/1/2014')
        },{
            _id: 2,
            sender_name: 'Josh Pagley',
            sender_type: 'member',
            sender_church: 12345,
            message: 'It was fun. Im glad you asked me to come and help!',
            createdAt: new Date('5/4/2014')
        },{
            _id: 3,
            sender_name: 'Hope Church',
            sender_type: 'church',
            sender_church: 12345,
            message: 'Hi jeremy, I just wanted to say thanks for your help tonight with the tech. It was a pleasure having your there.' +
                'Hi jeremy, I just wanted to say thanks for your help tonight with the tech. It was a pleasure having your there.' +
                'Hi jeremy, I just wanted to say thanks for your help tonight with the tech. It was a pleasure having your there.' +
                'Hi jeremy, I just wanted to say thanks for your help tonight with the tech. It was a pleasure having your there.' +
                'Hi jeremy, I just wanted to say thanks for your help tonight with the tech. It was a pleasure having your there.',
            createdAt: new Date('5/4/2014')
        },{
            _id: 4,
            sender_name: 'Josh Pagley',
            sender_type: 'member',
            sender_church: 12345,
            message: 'Just let me know if your guys are ever short some again. I would be more than happy to help out.',
            createdAt: new Date('5/7/2014')
        },{
            _id: 5,
            sender_name: 'Hope Church',
            sender_type: 'church',
            sender_church: 12345,
            message: 'Thanks! We really appreciate it so much.',
            createdAt: new Date('5/9/2014')
        },{
            _id: 6,
            sender_name: 'Hope Church',
            sender_type: 'church',
            sender_church: 12345,
            message: 'Hi jeremy, I just wanted to say thanks for your help tonight with the tech. It was a pleasure having your there.' +
                'Hi jeremy, I just wanted to say thanks for your help tonight with the tech. It was a pleasure having your there.' +
                'Hi jeremy, I just wanted to say thanks for your help tonight with the tech. It was a pleasure having your there.' +
                'Hi jeremy, I just wanted to say thanks for your help tonight with the tech. It was a pleasure having your there.' +
                'Hi jeremy, I just wanted to say thanks for your help tonight with the tech. It was a pleasure having your there.',
            createdAt: new Date('5/10/2014')
        },{
            _id: 7,
            sender_name: 'Hope Church',
            sender_type: 'church',
            sender_church: 12345,
            message: 'Hi jeremy, I just wanted to say thanks for your help tonight with the tech. It was a pleasure having your there.' +
                'Hi jeremy, I just wanted to say thanks for your help tonight with the tech. It was a pleasure having your there.' +
                'Hi jeremy, I just wanted to say thanks for your help tonight with the tech. It was a pleasure having your there.' +
                'Hi jeremy, I just wanted to say thanks for your help tonight with the tech. It was a pleasure having your there.' +
                'Hi jeremy, I just wanted to say thanks for your help tonight with the tech. It was a pleasure having your there.',
            createdAt: new Date('5/11/2014')
        }]
    }] */

    /**
     * Checks to see if there is already a conversation existing between two participants.
     *
     * (1) Loop through each of the local conversations
     *     - Save the members of each conversation in members array
     *     - Check to see if the recipient _ids passed into checkForPreExistingConversation
     *       match the members ids that are inside the members array from one of the existing
     *       conversation objects.
     *     - Check to see if an existing conversation contains the specified recipients
     *       and same amount of participants. If there is an existing conversation object
     *       that matches those requirements then populate preExistingConversation with
     *       the existing conversation object, along with the index of the conversation
     *       object inside of the local conversations array.
     *
     * (2) If preExistingConversation is populated with conversation object and not false then
     *     return the preExistingConversation.
     *     If preExistingConversation is not populated then checkForPreExistingConversation
     *     will return false.
     *
     *
     * @param recipients
     * @returns {*}
     */
    function checkForPreExistingConversation(recipients){
        var preExistingConversation;

        vm.conversations.forEach(function(conversation, index){
            var members = [];
            conversation.members.forEach(function(member){
                //Below where it says 'member.id' is where you can change
                //the field that gets searched for pre-existing conversations.
                members.push(member);
            });

            var alreadyExists = recipients.every(function(name){
                if(members.indexOf(name) != -1){
                    return true;
                } else {
                    return false;
                }
            });

            if(alreadyExists && conversation.members.length === recipients.length){
                preExistingConversation = conversation;
                preExistingConversation['index'] = index;
                return true;
            } else {
                return false;
            }
        });

        if(preExistingConversation){
            return preExistingConversation;
        } else {
            return false;
        }
    }

    /**
     * Create Conversation Queries
     *
     * The conversation queries are arrays of the participants in the conversation.
     * The conversation queries are used in checking if conversations already exist
     * between two or more participants.
     *
     * Example between one conversation query between two members: [{owner: _id}, _id]
     *
     * The first element is an object and the following elements are ids of the participants.
     * A conversation query will be generated for each participant in the conversation. Each
     * member in the conversation will be placed inside of the owner object followed by the
     * other participants. Example below.
     *
     * I.E.
     * Participants:
     * - ['josh', 'bill', 'joe']
     *
     * Conversation Queries:
     * - [{owner: 'josh'}, 'bill', 'joe']
     * - [{owner: 'joe'}, 'josh', 'bill']
     * - [{owner: 'bill'}, 'joe', 'josh']
     *
     *
     * (1) Add the sender _id to the list of recipients so that the conversation
     *     queries can be created with all participating members.
     * (2) Return all created conversation queries.
     *
     * @param sender - The admin object of the admin logged into the portal.
     * @param recipients - Array of member _ids the church is sending the message to.
     * @returns Array of conversation queries.
     */
    function createConversationQueries(sender, recipients){
        var conversationQueries = [];

        recipients.push(sender._id);
        recipients.forEach(function(member){
            var members = recipients.filter(function(element){
                return element != member;
            });

            members.unshift({'owner': member});

            conversationQueries.push(members);
        });

        return conversationQueries;
    }

    /**
     * Create New Conversation
     *
     * (1) Get conversation queries by calling createConversationQueries function.
     *
     * (2) Create new conversation object to send to server.
     *
     * (3) Make request to server:
     *     (Success) push new conversation onto local conversation array (vm.conversations).
     *     (Failure) log out error message.
     *
     * @param sender - Admin object of admin currently logged into church portal.
     * @param recipients - Array of member _ids the church is sending the message to.
     * @param message - Text of the new message.
     * @returns promise object from server call.
     */
    function createConversation(sender, recipients, message){
        var conversationQueries = createConversationQueries(sender, recipients);

        var conversationObj = {
            "sender": sender._id,
            "conversationQueries": conversationQueries,
            "message": {
                "name": sender.name,
                "sender": sender._id,
                "msg": message
            }
        };

        var promise = $q.defer();
        conversationsResource.save(conversationObj, function(result){
            vm.conversations.push(result.conversation);
            console.log(vm.conversations);
            promise.resolve();
        }, function(error){
            console.log(error);
            promise.reject(error);
        });

        return promise.promise;

    }

    vm.getConversations = function(adminID){
        var promise = $q.defer();
        conversationsResource.get({'owner': adminID}, function(result){
            vm.conversations = result.conversations;
            promise.resolve();
        }, function(error){
            console.log(error);
            promise.reject(error);
        });
        return promise.promise;
    };

    vm.deleteConversation = function(conversation){
        var promise = $q.defer();
        conversationsResource.delete({'conversation': conversation._id}, function(result){
            vm.conversations.splice(conversation.index, 1);
            promise.resolve(result);
        }, function(error){
            console.log(error);
            promise.reject(error);
        });
    };


    /**
     * Send Message
     *
     * (1) Check to see if pre-existing conversation already exists between the
     * church and the participants the church is sending the message to.
     *  - If a conversation exists then preExistingConversation will be populated
     *    with the existing conversation.
     *  - If a conversation does not exist then preExistingConversation will be
     *    false.
     *
     * (2) If preExistingConversation is populated
     *    - Get conversation queries by calling createConversationQueries
     *    - Create new message object to send to the server.
     *    - Make Request back to server:
     *      (Success) push new message onto local conversation
     *      (Failure) log out error
     *
     * (3) If preExistingConversation is false
     *     - create new conversation by calling createConversation function.
     *
     * @param sender - The admin object of the current church admin logged in.
     * @param recipients - Array of participant id's
     * @param message - Text of the message being sent
     */
    vm.sendMessage = function(sender, recipients, message){
        var preExistingConversation = checkForPreExistingConversation(recipients);

        if(preExistingConversation){
            console.log('pre existing conversation exists.');

            var conversationQueries = createConversationQueries(sender, recipients);

            var msgObj = {
                "conversation": preExistingConversation._id,
                "conversationQueries": conversationQueries,
                "message": {
                    "name": sender.name,
                    "sender": sender._id,
                    "msg": message
                }
            }

            var promise = $q.defer();
            messagesResource.save(msgObj, function(result){
                console.log(result.message);
                vm.conversations[preExistingConversation.index].messages.push(result.message);
                promise.resolve();
            }, function(error){
                console.log(error);
                promise.reject(error);
            });

            return promise.promise;
        } else {
            console.log('Pre existing conversation does not exist.');
            //Conversation does not exist
            return createConversation(sender, recipients, message);
        }
    }

    vm.deleteMessage = function(conversation, messageIndex){
        var message = vm.conversations[conversation.index].messages[messageIndex];

        var promise = $q.defer();
        messagesResource.delete({'conversation': conversation._id, 'message': message._id}, function(result){
            vm.conversations[conversation.index].messages.splice(messageIndex, 1);
            promise.resolve();
        }, function(error){
            promise.reject(error);
        });

        return promise.promise;
    };

    return vm;

    //Old zcMessages Code
//    return {
//        getConversations: function(adminID){
//            var promise = $q.defer();
//            //Check for local conversations first.
//            if(vm.conversations.length > 0){
//                console.log('Returning local conversations.');
//                promise.resolve(vm.conversations);
//            } else {
//                //Get conversations from server.
//                conversationsResource.get({'owner': adminID}, function(result){
//                    console.log('Getting conversations from server.');
//                    vm.conversations = result.conversations;
//                    promise.resolve(vm.conversations);
//                }, function(error){
//                    console.log(error);
//                    promise.reject(error);
//                });
//            }
//            return promise.promise;
//        },
//        deleteConversation: function(conversation){
//            var promise = $q.defer();
//            conversationsResource.delete({'conversation': conversation._id}, function(result){
//                vm.conversations.splice(conversation.index, 1);
//                promise.resolve(result);
//            }, function(error){
//                console.log(error);
//                promise.reject(error);
//            });
//
//            return promise.promise;
//        },
//        sendMessage: function(sender, recipients, message){
//            var preExistingConversation = checkForPreExistingConversation(recipients);
//
//            if(preExistingConversation){
//                console.log('pre existing conversation exists.');
//
//                var conversationQueries = createConversationQueries(sender, recipients);
//
//                var msgObj = {
//                    "conversation": preExistingConversation._id,
//                    "conversationQueries": conversationQueries,
//                    "message": {
//                        "name": sender.name,
//                        "sender": sender._id,
//                        "msg": message
//                    }
//                }
//
//                var promise = $q.defer();
//                messagesResource.save(msgObj, function(result){
//                    console.log(result);
//                    vm.conversations[preExistingConversation.index].messages.push(result.message);
//                    promise.resolve(result.message);
//                }, function(error){
//                    console.log(error);
//                    promise.reject(error);
//                });
//
//                return promise.promise;
//            } else {
//                console.log('Pre existing conversation does not exist.');
//                //Conversation does not exist
//                return createConversation(sender, recipients, message);
//            }
//        },
//        deleteMessage: function(conversation, messageIndex){
//           var message = vm.conversations[conversation.index].messages[messageIndex];
//
//            var promise = $q.defer();
//            messagesResource.delete({'conversation': conversation._id, 'message': message._id}, function(result){
//                vm.conversations[conversation.index].messages.splice(messageIndex, 1);
//                promise.resolve(result);
//            }, function(error){
//                promise.reject(error);
//            });
//
//            return promise.promise;
//        }
//    }
}]);