/**
 * Created by Josh Pagley on 5/16/14.
 */

var async = require('async');
var _ = require('underscore');

//Models
var Conversation = require('../models/conversation.js');
var Member = require('../models/member.js');

//{'conversationQueries': [[{'owner': id}, id, id], [{'owner':id}, id, id], etc.], 'sender': id,
// 'message': {'sender_name': string, 'sender_type': String, 'sender': id, 'recipient':id, 'message': string}}
exports.createConversation = function(req, res){
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

    async.each(msgObj.conversationQueries,
        function(element, done){
            Conversation.findOne({'owner': element[0].owner, members: {$all: element.slice(1), $size: element.slice(1).length}}, function(error, conversation){
                if(error){
                    done(error);
                } else if (conversation){
                    conversation.messages.push(msgObj.message);
                    conversation.save(function(error){
                        if(error){
                            done(error);
                        } else {
                            done();
                        }
                    });
                } else {
                    var conversationObj = {
                        owner: element[0].owner,
                        members: element.slice(1),
                        messages: [msgObj.message]
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
                                ownerConversation['messages'] = newConversation.messages;
                                ownerConversation['members'] = newConversation.members;
                                ownerConversation['memberObjects'] = [];
                                done();
                            } else {
                                done();
                            }
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

//{'conversation': id, conversationQueries': [[{'owner': id}, id, id],
// message: {'sender_name': string, 'sender': id, 'recipient':id, 'message': string}}
exports.createMessage = function(req, res){
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
        return res.json(400, {'error':'Message Object sender_name is required.'});
    }

    if(!msgObj.message.msg){
        return res.json(400, {'error':'Message Object message is required.'});
    }

    var newMessage = {};
    async.each(msgObj.conversationQueries,
        function(element, done){
            Conversation.findOne({'owner': element[0].owner, members: {$all: element.slice(1), $size: element.slice(1).length}}, function(error, conversation){
                if(error){
                    done(error);
                } else if (conversation){
                    conversation.messages.push(msgObj.message);
                    conversation.save(function(error, conversation){
                        if(error){
                            done(error);
                        } else {
                            newMessage = conversation.messages[conversation.messages.length - 1];
                            done();
                        }
                    });
                } else {
                    var conversationObj = {
                        owner: element[0].owner,
                        members: element.slice(1),
                        messages: [msgObj.message]
                    };

                    Conversation.create(conversationObj, function(error){
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