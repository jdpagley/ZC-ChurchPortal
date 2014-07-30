/**
 * Created by Josh Pagley on 5/16/14.
 */

var async = require('async');
var _ = require('underscore');

//Models
var Conversation = require('../models/conversation.js');
var Member = require('../models/member.js');
var MessagePage = require('../models/messagePage.js');

/**
 * Create New Conversation
 *
 * ownerConversation is used as the newly updated/created conversation object to send
 * back to the client.
 *
 * (1) Loop through each conversation query to see if the conversation exists already.
 *     Example of what the conversation queries look like below.
 *
 * Example between one conversation query between two members: [{owner: _id}, _id]
 *
 * The first element is an object and the following elements are ids of the participants.
 * A conversation query will be sent for each participant in the conversation. Each
 * member in the conversation is placed inside of the owner object followed by the
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
 * (2) Conversation Exists
 *     - async.waterfall():
 *       1. Update existing message page if it is not full. If the message page is full
 *          then create new message page and updated conversation num_message_page count.
 *       2. Update conversation object. Push new message into messages cache. If messages
 *          cache contains more than 10 messages, remove oldest message from cache and
 *          push into cache newest message.
 *       3. Save updated conversation. Use the newly updated conversation to populate
 *          the ownerConversation object.
 *
 * (3) Conversation Does not exist
 *     - async.waterfall():
 *      1. Create new conversation object and push new message into messages cache.
 *      2. Create new message page.
 *
 * (4) Send back owner conversation after populating the member objects and pushing
 *     them into the memberObjects field of the owner conversation.
 *     - memberObjects are used to display the name and profile avatar of conversation
 *       participants.
 *
 * req.body: {
 *      conversationQueries: [[{'owner': id}, id, id], [{'owner':id}, id, id], etc.],
 *      sender: id,
 *      message: {
 *          name: string,
 *          sender: id,
 *          message: string
 *      }
 * }
 */
exports.createConversation = function(req, res){
    console.log('createConversation hit.');
    var msgObj = req.body;

    if(!msgObj){
        return res.json(400, {'error':'POST body is required.'});
    }

    if(!msgObj.sender){
        return res.json(200, {'error': 'sender is required.'});
    }

    if(!msgObj.conversationQueries){
        return res.json(200, {'error': 'Conversation must contain recipients.'});
    }

    if(msgObj.conversationQueries.length < 1){
        return res.json(200, {'error': 'Conversation must contain at least one recipient.'});
    }

    if(!msgObj.message){
        return res.json(200, {'error': 'Message is required.'});
    }

    //Looking for existing conversation objects
    var ownerConversation = {};
    var newMessagePageCreated = false;

    async.each(msgObj.conversationQueries,
        function(element, done){
            Conversation.findOne({'owner': element[0].owner, members: {$all: element.slice(1), $size: element.slice(1).length}}, function(error, conversation){
                if(error){
                    done(error);
                } else if (conversation){
                    /**
                     * Conversation Exists
                     */
                    var message = {
                        "msg_num": conversation.num_messages + 1,
                        "name": msgObj.message.name,
                        "sender": msgObj.message.sender,
                        "msg": msgObj.message.msg,
                        "ts": new Date()
                    };

                    async.waterfall([
                        function(done){

                            /**
                             * Update messages page for existing conversation.
                             */
                            MessagePage.update({
                                'node_id': conversation._id,
                                'page': conversation.num_message_pages,
                                'count': {$lt: 50}}, {
                                $inc: {'count': 1},
                                $push: {'messages': message}
                            }, function(error, numberAffected, raw){
                                if(error){
                                    done(error);
                                } else if (raw.updatedExisting){
                                    console.log('Udpated existing message page');

                                    MessagePage.findOne({
                                        'node_id': conversation._id,
                                        'page': conversation.num_message_pages
                                    }, function(error, messagePage){
                                        if(error){
                                            done(error);
                                        } else if (!messagePage){
                                            done(null, null);
                                        } else {
                                            newMessagePageCreated = false;
                                            done(null, messagePage);
                                        }
                                    });
                                } else if (!raw.updatedExisting){
                                    console.log('Message page does not exist');
                                    /**
                                     * If existing page was not updated then create new messages page.
                                     */
                                    var newMessagesPage = {
                                        'node_id': conversation._id,
                                        'page': conversation.num_message_pages + 1,
                                        'count': 1,
                                        'messages': [message]
                                    };

                                    MessagePage.create(newMessagesPage, function(error, messagePage){
                                        if(error){
                                            done(error);
                                        } else if (!messagePage){
                                            done(new Error('Error adding new messages page.'));
                                        } else {
                                            newMessagePageCreated = true;
                                            done(null, messagePage);
                                        }
                                    });
                                }
                            });
                        },
                        function(messagePage, done){

                            console.log('MessagePage: ');
                            console.log(messagePage);

                            /**
                             * Update conversation object and add message to messages cache
                             */

                            if(newMessagePageCreated){
                                conversation.num_message_pages += 1;
                            }

                            if(messagePage){
                                var mutableMessagePage = messagePage;

                                if(conversation.messages.length >= 10){
                                    conversation.num_messages += 1;
                                    conversation.messages.splice(conversation.messages.length - 1, 1);
                                    conversation.messages.unshift(mutableMessagePage.messages.pop());
                                } else {
                                    conversation.num_messages += 1;
                                    conversation.messages.unshift(mutableMessagePage.messages.pop());
                                }
                            }

                            done();

                        }],
                        function(error){
                            if(error){
                                done(error)
                            } else {
                                /**
                                 * Save updated conversation object.
                                 */

                                conversation.save(function(error, conversation){
                                    if(error){
                                        done(error);
                                    } else {
                                        if(element[0].owner == msgObj.sender){
                                            ownerConversation['createdAt'] = conversation.createdAt;
                                            ownerConversation['updatedAt'] = conversation.updatedAt;
                                            ownerConversation['owner'] = conversation.owner;
                                            ownerConversation['_id'] = conversation._id;
                                            ownerConversation['num_message_pages'] = conversation.num_message_pages;
                                            ownerConversation['num_messages'] = conversation.num_messages;
                                            ownerConversation['messages'] = conversation.messages;
                                            ownerConversation['members'] = conversation.members;
                                            ownerConversation['memberObjects'] = [];
                                        }

                                        done();
                                    }
                                });
                            }
                        });

                } else {
                    /**
                     * Conversation Does not exist.
                     */

                    var message = {
                        "msg_num": 1,
                        "name": msgObj.message.name,
                        "sender": msgObj.message.sender,
                        "msg": msgObj.message.msg,
                        "ts": new Date()
                    };

                    async.waterfall([
                        function(done){
                            /**
                             * Create New Conversation
                             */

                            var conversationObj = {
                                owner: element[0].owner,
                                members: element.slice(1),
                                messages: [message],
                                num_message_pages: 1,
                                num_messages: 1,
                                createdAt: new Date(),
                                updatedAt: new Date()
                            };

                            Conversation.create(conversationObj, function(error, newConversation){
                                if(error){
                                    done(error);
                                } else {
                                    if(element[0].owner == msgObj.sender){
                                        ownerConversation['createdAt'] = newConversation.createdAt;
                                        ownerConversation['updatedAt'] = newConversation.updatedAt;
                                        ownerConversation['owner'] = newConversation.owner;
                                        ownerConversation['_id'] = newConversation._id;
                                        ownerConversation['num_message_pages'] = newConversation.num_message_pages;
                                        ownerConversation['num_messages'] = newConversation.num_messages;
                                        ownerConversation['messages'] = newConversation.messages;
                                        ownerConversation['members'] = newConversation.members;
                                        ownerConversation['memberObjects'] = [];
                                        done(null, newConversation);
                                    } else {
                                        done(null, newConversation);
                                    }
                                }
                            });

                        },
                        function(newConversation, done){
                            /**
                             * Create New Message Page or New Conversation
                             */

                            var newMessagesPage = {
                                'node_id': newConversation._id,
                                'page': newConversation.num_message_pages,
                                'count': 1,
                                'messages': [message]
                            };

                            MessagePage.create(newMessagesPage, function(error, messagePage){
                                if(error){
                                    done(error);
                                } else if (!messagePage){
                                    done(new Error('Error adding new messages page.'));
                                } else {
                                    done();
                                }
                            });

                        }],
                        function(error){
                            if(error){
                                done(error);
                            } else {
                                done();
                            }
                        });


                }
            });
        },
        function(error){
            if(error){
                return res.json(500, {'error': 'Server Error.', 'mongoError': error});
            } else {
                if(ownerConversation){
                    async.each(ownerConversation.members,
                        function(member, done){
                            //Todo: Return profile avatar for the members of the conversation when doing the findById
                            Member.findById(member, 'name', function(error, member){
                                if(error){
                                    done(error);
                                } else if (!member) {
                                    done(new Error('Not able to retrieve conversation member.'));
                                } else {
                                    ownerConversation['memberObjects'].push({'_id': member._id, 'name': member.name});
                                    done();
                                }
                            });
                        },
                        function(error){
                            if(error){
                                return res.json(500, {'error': 'Server Error.', 'mongoError': error});
                            } else {
                                return res.json(200, {'conversation': ownerConversation});
                            }
                        })
                }
            }
        });

}

//{'conversation': id}
exports.deleteConversation = function(req, res){
    var msgObj = req.query;

    if(!msgObj){
        return res.json(400, {'error':'Deletion Query is required.'});
    }

    if(!msgObj.conversation){
        return res.json(400, {'error':'Conversation id is required.'});
    }

    Conversation.findByIdAndRemove(msgObj.conversation, function(error){
        if(error){
            return res.json(500, {'error': 'Server Error.', 'mongoError': error});
        } else {
            return res.json(200, {'success': 'Successfully removed conversation.'});
        }
    });
}

//{'owner': id}
exports.retrieveConversations = function(req, res){
    var msgObj = req.query;

    if(!msgObj){
        return res.json(400, {'error':'POST body is required.'});
    }

    if(!msgObj.owner){
        return res.json(400, {'error':'owner is required.'});
    }

    Conversation.find({'owner': msgObj.owner}, function(error, conversations){
        if(error){
            return res.json(500, {'error': 'Server Error.', 'mongoError': error});
        } else if (!conversations){
            return res.json(400, {'error': 'No conversations for that owner.'});
        } else {
            var populatedConversationsArray = [];

            async.each(conversations,
                function(conversation, done){

                    var memberPopulatedConversation = {};
                    memberPopulatedConversation['_id'] = conversation._id;
                    memberPopulatedConversation['owner'] = conversation.owner;
                    memberPopulatedConversation['messages'] = conversation.messages;
                    memberPopulatedConversation['members'] = conversation.members;
                    memberPopulatedConversation['createdAt'] = conversation.createdAt;
                    memberPopulatedConversation['updatedAt'] = conversation.updatedAt;
                    memberPopulatedConversation['memberObjects'] = [];

                    async.each(conversation.members,
                        function(member, done){
                            //Todo: Return profile avatar for the members of the conversation when doing the findById
                            Member.findById(member, 'name', function(error, member){
                                if(error){
                                    done(error);
                                } else if (!member) {
                                    done(new Error('Not able to retrieve conversation member.'));
                                } else {
                                    memberPopulatedConversation['memberObjects'].push({'_id': member._id, 'name': member.name});
                                    done();
                                }
                            });
                        },
                        function(error){
                            if(error){
                                done(error);
                            } else {
                                populatedConversationsArray.push(memberPopulatedConversation);
                                done();
                            }
                        })
                },
                function(error){
                    if(error){
                        return res.json(500, {'error': error});
                    } else {
                        return res.json(200, {'conversations': populatedConversationsArray});
                    }
                });
        }
    })

}

/**
 * Create Message
 *
 * ownerConversation is used as the newly updated/created conversation object to send
 * back to the client.
 *
 * (1) Loop through each conversation query to see if the conversation exists already.
 *     Example of what the conversation queries look like below.
 *
 * Example between one conversation query between two members: [{owner: _id}, _id]
 *
 * The first element is an object and the following elements are ids of the participants.
 * A conversation query will be sent for each participant in the conversation. Each
 * member in the conversation is placed inside of the owner object followed by the
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
 * (2) Conversation Exists
 *     - async.waterfall():
 *       1. Update existing message page if it is not full. If the message page is full
 *          then create new message page and updated conversation num_message_page count
 *          and pass new message page on.
 *       2. Update conversation object. Push new message into messages cache. If messages
 *          cache contains more than 10 messages, remove oldest message from cache and
 *          push into cache newest message.
 *       3. Save updated conversation. Use the newly created message for the owners
 *          conversation object and add it to the newMessage variable. The newMessage
 *          variable will be sent back to the client for them to update their messages
 *          locally.
 *
 * (3) Conversation does not exist
 *     - async.waterfall():
 *      1. Create new conversation object and push new message into messages cache.
 *      2. Create new message page.
 *
 * (4) Send back owner conversation after populating the member objects and pushing
 *     them into the memberObjects field of the owner conversation.
 *     - memberObjects are used to display the name and profile avatar of conversation
 *       participants.
 *
 * req.body: {
 *      conversationQueries: [[{'owner': id}, id, id], [{'owner':id}, id, id], etc.],
 *      conversation: id,
 *      message: {
 *          name: string,
 *          sender: id,
 *          message: string
 *      }
 * }
 */
exports.createMessage = function(req, res){
    console.log('createMessage function hit.')
    var msgObj = req.body;

    if(!msgObj){
        return res.json(400, {'error':'POST body is required.'});
    }

    if(!msgObj.conversation){
        return res.json(400, {'error':'Conversation id is required.'});
    }

    if(!msgObj.conversationQueries){
        return res.json(400, {'error':'Conversation queries are required.'});
    }

    if(!msgObj.message){
        return res.json(400, {'error':'Message Object is required.'});
    }

    if(!msgObj.message.name){
        return res.json(400, {'error':'Message Object sender name is required.'});
    }

    if(!msgObj.message.sender){
        return res.json(400, {'error':'Message Object sender is required.'});
    }

    if(!msgObj.message.msg){
        return res.json(400, {'error':'Message Object message is required.'});
    }

    var newMessage = {};

    async.each(msgObj.conversationQueries,
        function(element, done){
            var newMessagePageCreated = false;

            /**
             * Check to see if conversation exists
             */
            Conversation.findOne({'owner': element[0].owner, members: {$all: element.slice(1), $size: element.slice(1).length}}, function(error, conversation){
                if(error){
                    done(error);
                } else if(conversation){

                    /**
                     * Conversation Exists
                     */

                    var message = {
                        "msg_num": conversation.num_messages + 1,
                        "name": msgObj.message.name,
                        "sender": msgObj.message.sender,
                        "msg": msgObj.message.msg,
                        "ts": new Date()
                    };

                    async.waterfall([
                            function(done){
                                /**
                                 * Update messages page for existing conversation.
                                 *
                                 * (1) Existing message page updated:
                                 *      - fetch new message from updated message page and
                                 *        pass it the the callback function.
                                 *
                                 * (2) Existing message page not updated:
                                 *      - Create new message page.
                                 *      - Fetch new message from newly created message page
                                 *        and pass it to the callback function.
                                 */
                                MessagePage.update({
                                    'node_id': conversation._id,
                                    'page': conversation.num_message_pages,
                                    'count': {$lt: 50}}, {
                                    $inc: {'count': 1},
                                    $push: {'messages': message}
                                }, function(error, numberAffected, raw){
                                    if(error){
                                        done(error);
                                    } else if (raw.updatedExisting){
                                        /**
                                         * Retrieve updated message page from db.
                                         * Fetch the newest message in the messages array and
                                         * pass that message to the async.waterfall callback.
                                         */

                                        MessagePage.findOne({'node_id': conversation._id, 'page': conversation.num_message_pages}, function(error, messagePage){
                                            if(error){
                                                done(error);
                                            } else if (!messagePage){
                                                done(null, null);
                                            } else {
                                                newMessagePageCreated = false;
                                                var messageContainer = messagePage.messages[messagePage.messages.length - 1];
                                                done(null, messageContainer);
                                            }
                                        });

                                    } else if (!raw.updatedExisting){
                                        /**
                                         * Create new messages page if previous message page is full.
                                         *
                                         * (1) Create new message page object.
                                         *
                                         * (2) Make request to database to create new message page.
                                         *     and pass newly created message inside the message page
                                         *     to the async.waterfall callback function.
                                         */

                                        var newMessagesPage = {
                                            'node_id': conversation._id,
                                            'page': conversation.num_message_pages + 1,
                                            'count': 1,
                                            'messages': [message]
                                        };

                                        MessagePage.create(newMessagesPage, function(error, messagePage){
                                            if(error){
                                                done(error);
                                            } else if (!messagePage){
                                                done(new Error('Error adding new messages page.'));
                                            } else {
                                                newMessagePageCreated = true;
                                                var messageContainer = messagePage.messages[messagePage.messages.length -1];
                                                done(null, messageContainer);
                                            }
                                        });
                                    }
                                });
                            },
                            function(messageContainer, done){

                                /**
                                 * Update Conversation Object
                                 *
                                 * (1) If new message page was created for conversation update the
                                 *     conversation.num_messages_pages to itself plus one.
                                 *
                                 * (2) If messageContainer contains a message then update the conversation
                                 *     num_messages and messages cache.
                                 *
                                 * (3) Pass messageContainer to callback function.
                                 */
                                if(newMessagePageCreated){
                                    conversation.num_message_pages += 1;
                                }

                                if(messageContainer._id){
                                    if(conversation.messages.length >= 10){
                                        conversation.num_messages += 1;
                                        conversation.messages.splice(conversation.messages.length - 1, 1);
                                        conversation.messages.unshift(messageContainer);
                                    } else {
                                        conversation.num_messages += 1;
                                        conversation.messages.unshift(messageContainer);
                                    }

                                    done(null, messageContainer);
                                } else {
                                    done(new Error('No message in messageContainer.'));
                                }

                            }],
                            function(error, messageContainer){
                                if(error){
                                    done(error)
                                } else {

                                    /**
                                     * Save Updated Conversation.
                                     *
                                     * (1) If the owner in the conversation query is the same as the
                                     *     sender of the message, then add the messageContainer to the
                                     *     newMessage variable.
                                     *
                                     * Explanation: newMessage is used as the newly created message to
                                     *              send back to the client so they can update their
                                     *              conversation messages locally.
                                     */
                                    conversation.save(function(error){
                                        if(error){
                                            done(error);
                                        } else {
                                            if(element[0].owner == msgObj.message.sender){
                                                newMessage = messageContainer;
                                            }

                                            done();
                                        }
                                    });
                                }
                            });

                } //else {
//                    /**
//                     * Conversation Does not exist.
//                     */
//
//                    var message = {
//                        "name": msgObj.message.name,
//                        "sender": msgObj.message.sender,
//                        "msg": msgObj.message.msg,
//                        "ts": new Date()
//                    };
//
//                    async.waterfall([
//                            function(done){
//                                /**
//                                 * Create New Conversation
//                                 */
//
//                                var conversationObj = {
//                                    owner: element[0].owner,
//                                    members: element.slice(1),
//                                    messages: [message],
//                                    num_message_pages: 1,
//                                    num_messages: 1,
//                                    createdAt: new Date(),
//                                    updatedAt: new Date()
//                                };
//
//                                Conversation.create(conversationObj, function(error, newConversation){
//                                    if(error){
//                                        done(error);
//                                    } else {
//                                        if(element[0].owner == msgObj.sender){
//                                            ownerConversation['createdAt'] = conversation.createdAt;
//                                            ownerConversation['updatedAt'] = conversation.updatedAt;
//                                            ownerConversation['owner'] = conversation.owner;
//                                            ownerConversation['_id'] = conversation._id;
//                                            ownerConversation['num_message_pages'] = conversation.num_message_pages;
//                                            ownerConversation['num_messages'] = conversation.num_messages;
//                                            ownerConversation['messages'] = conversation.messages;
//                                            ownerConversation['members'] = conversation.members;
//                                            ownerConversation['memberObjects'] = [];
//                                        }
//
//                                        done(null, newConversation);
//                                    }
//                                });
//
//                            },
//                            function(newConversation, done){
//                                /**
//                                 * Create New Message Page or New Conversation
//                                 */
//
//                                var newMessagesPage = {
//                                    'node_id': newConversation._id,
//                                    'page': newConversation.num_message_pages,
//                                    'count': 1,
//                                    'messages': [message]
//                                };
//
//                                MessagePage.create(newMessagesPage, function(error, messagePage){
//                                    if(error){
//                                        done(error);
//                                    } else if (!messagePage){
//                                        done(new Error('Error adding new messages page.'));
//                                    } else {
//                                        done();
//                                    }
//                                });
//
//                            }],
//                        function(error){
//                            if(error){
//                                done(error);
//                            } else {
//                                done();
//                            }
//                        });
//                }
            });
        },
        function(error){
            if(error){
                console.log(error);
                return res.json(500, {'error': 'Server Error.', 'mongoError': error});
            } else {
                return res.json(200, {'message': newMessage});
            }
        });
}

//{'conversation': id, 'message': id}
exports.deleteMessage = function(req, res){
    var msgObj = req.query;
    console.log(msgObj);

    if(!msgObj){
        return res.json(400, {'error':'Deletion Query is required.'});
    }

    if(!msgObj.conversation){
        return res.json(400, {'error':'Conversation id is required.'});
    }

    if(!msgObj.message){
        return res.json(400, {'error':'Message id is required.'});
    }

    Conversation.findById(msgObj.conversation, function(error, conversation){
        if(error){
            return res.json(500, {'error': 'Server Error', 'mongoError': error});
        } else if(!conversation){
            return res.json(400, {'error': 'No conversation with that id.'});
        } else {

            //Todo: Delete converstaion when there are no messages in it.

            conversation.messages.id(msgObj.message).remove(function(error){
                if(error){
                    return res.json(500, {'error': 'Server Error', 'mongoError': error});
                } else {
                    conversation.save(function(error){
                        if(error){
                            return res.json(500, {'error': 'Server Error', 'mongoError': error});
                        } else {
                            return res.json(200, {'success': 'Successfully deleted message.'});
                        }
                    });
                }
            });

        }
    })

}