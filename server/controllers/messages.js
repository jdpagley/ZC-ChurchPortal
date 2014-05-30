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

    if(!msgObj){
        return res.json(400, {'error':'POST body is required.'});
    }

    if(!msgObj.members){
        return res.json(200, {'error': 'Conversation members are required.'});
    }

    if(msgObj.members.length < 2){
        return res.json(200, {'error': 'Conversation must contain at least two members.'});
    }

    var newConversation = {};
    newConversation['members'] = [];
    newConversation['messages'] = [];

    //Todo: Check to see if conversation already exists between these two members.
    //IF it does already exist, just take the message and add it to the conversation.
    async.parallel([
        function(done){
            async.each(msgObj.members,
                function(member, done){
                    console.log(member);
                    if(member.account_type == 'church'){
                        newConversation.members.push({
                            account_type: 'church',
                            account_church: member.account_church,
                            account_name: member.account_name
                        });

                        done();
                    } else {
                        newConversation.members.push({
                            account_type: 'member',
                            account_member: member.account_member,
                            account_name: member.account_name
                        });

                        done();
                    }
                },
                function(error){
                    if(error) res.json(500, {'error': error});

                    done();
                });
        },
        function(done){
            if(msgObj.message){
                newConversation.messages.push({
                    sender_type: msgObj.message.sender_type,
                    sender_name: msgObj.message.sender_name,
                    sender: msgObj.message.sender,
                    recipient: msgObj.message.recipient,
                    message: msgObj.message.message
                });
                done();
            } else {
                done();
            }
        }],
        function(error){
            if(error) return res.json(500, {'error': error});

            Conversation.create(newConversation, function(error, conversation){
                if(error){
                    return res.json(500, {'error': 'Server Error', 'mongoError': error});
                } else {
                    return res.json(200, {'conversation': conversation});
                }
            })
        })
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

    if(!msgObj.account_type){
        return res.json(400, {'error':'Account type id is required.'});
    }

    if(!msgObj.account){
        return res.json(400, {'error':'Account is required.'});
    }

    if(msgObj.account_type == 'church'){
        Conversation.find({$or: [{'messages.account_church': msgObj.account}]});
    } else if (msgObj.account_type == 'member'){
        Conversation.find({$or: [{'messages.account_member': msgObj.account}]})
    } else {
        return res.json(400, {'error': 'Please specify either "church" or "member" for account type.'});
    }

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