/**
 * Created by Josh Pagley on 5/16/14.
 */

var async = require('async');
var _ = require('underscore');

//Models
var Conversation = require('../models/conversation.js');

//{'members': [{'account_type': string, 'account_church': id, 'account_member': id, 'account_name': string}],
// 'message': {'sender_name': string, 'sender_type': String, 'sender': id, 'recipient':id, 'message': string}}
exports.createConversation = function(req, res){
    var msgObj = req.body;
    console.log(msgObj);

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
                                ownerConversation = newConversation;
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
                return res.json(200, {'success': 'Successfully created new conversation.', 'conversation': ownerConversation});
            }
        });

}

//{'conversation': id, 'member': id}
exports.deleteConversation = function(req, res){
    var msgObj = req.query;

    if(!msgObj){
        return res.json(400, {'error':'Deletion Query is required.'});
    }

    if(!msgObj.conversation){
        return res.json(400, {'error':'Conversation id is required.'});
    }

    if(!msgObj.member){
        return res.json(400, {'error':'Member id is required.'});
    }

    Conversation.findById(msgObj.conversation, function(error, conversation){
        if(error){
            return res.json(500, {'error': 'Server Error', 'mongoError': error});
        } else if (!conversation) {
            return res.json(400, {'error': 'No conversation with that id.'});
        } else {
            if(conversation.members.length === 1){
                if(conversation.members[0].type == 'church'){
                    if(conversation.members[0].account_church == msgObj.member){
                        conversation.remove(function(error){
                            if(error){
                                return res.json(500, {'error': 'Server Error', 'mongoError': error});
                            } else {
                                return res.json(200, {'success': 'Conversation deleted.'});
                            }
                        })
                    }
                } else if (conversation.members[0].type == 'member') {
                    if(conversation.members[0].account_member == msgObj.member){
                        conversation.remove(function(error){
                            if(error){
                                return res.json(500, {'error': 'Server Error', 'mongoError': error});
                            } else {
                                return res.json(200, {'success': 'Conversation deleted.'});
                            }
                        })
                    }
                }
            } else if (conversation.members.length > 1){
                async.each(conversation.members,
                    function(member, done){
                        if(member.type == 'church'){
                            if(member.account_church == msgObj.member){
                                conversation.members.id(msgObj.member).remove(function(error){
                                    if(error){
                                        done(error);
                                    } else {
                                        done();
                                    }
                                });
                            } else {
                                done();
                            }
                        } else if (member.type == 'member') {
                            if(member.account_member == msgObj.member){
                                conversation.members.id(msgObj.member).remove(function(error){
                                    if(error){
                                        done(error);
                                    } else {
                                        done();
                                    }
                                });
                            } else {
                                done();
                            }
                        }
                    },
                    function(error){
                        if(error){
                            return res.json(500, {'error': 'Server Error', 'mongoError': error});
                        } else {
                            return res.json(200, {'success': 'Successfully removed member from conversation.'});
                        }
                    });
            }
        }
    });

}

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
            return res.json(200, {'conversations': conversations});
        }
    })

}

//{'conversation': id, message: {'sender_name': string, 'sender': id, 'recipient':id, 'message': string}}
exports.createMessage = function(req, res){
    var msgObj = req.body;

    if(!msgObj){
        return res.json(400, {'error':'POST body is required.'});
    }

    if(!msgObj.conversation){
        return res.json(400, {'error':'Conversation id is required.'});
    }

    if(!msgObj.message){
        return res.json(400, {'error':'Message Object is required.'});
    }

    if(!msgObj.message.sender_name){
        return res.json(400, {'error':'Message Object sender_name is required.'});
    }

    if(!msgObj.message.sender){
        return res.json(400, {'error':'Message Object sender is required.'});
    }

    if(!msgObj.message.recipient){
        return res.json(400, {'error':'Message Object recipient is required.'});
    }

    if(!msgObj.message.message){
        return res.json(400, {'error':'Message Object message is required.'});
    }

    Conversation.findById(msgObj.conversation, function(error, conversation){
        if(error){
            return res.json(500, {'error': 'Server Error', 'mongoError': error});
        } else if(!conversation) {
            return res.json(200, {'error': 'No conversation with that id.'})
        } else {
            conversation.messages.push({
                sender_name: msgObj.message.sender_name,
                sender: msgObj.message.sender,
                recipient: msgObj.message.recipient,
                message: msgObj.message.message
            });

            conversation.save(function(error, conversation){
                if(error){
                    return res.json(500, {'error': 'Server Error', 'mongoError': error});
                } else {
                    var messagesLength = conversation.messages.length;
                    console.log(conversation.messages[messagesLength - 1]);
                    return res.json(200, {'message': conversation.messages[messagesLength - 1]});
                }
            });
        }
    });
}

//{'conversation': id, 'message': id}
exports.deleteMessage = function(req, res){
    var msgObj = req.query;

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
                    return res.json(200, {'success': 'Successfully deleted message.'});
                }
            });

        }
    })

}