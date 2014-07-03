/**
 * Created by Josh Pagley on 5/15/14.
 */

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//NOTE: Not using any specific subdoc schema for the conversation members
var messageSchema = require('./message.js');

/*
 members: The participants inside the conversation
 messages: Messages in the conversation.
 */

var conversationSchema = new Schema({
    owner:                Schema.Types.ObjectId,
    members:              [Schema.Types.ObjectId],
    messages:             [messageSchema],
    createdAt:            Date,
    updatedAt:            Date
});

conversationSchema.pre('save', function(next){
    this.updatedAt = new Date();
    if (!this.createdAt){
        this.createdAt = new Date();
    }
    next();
});


module.exports = mongoose.model('Conversation', conversationSchema);