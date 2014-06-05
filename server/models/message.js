/**
 * Created by Josh Pagley on 5/15/14.
 * Description: Used for messages array in
 * conversation schema.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

/*
  sender_name: name of the account that sent the message.
  sender_type: type of account that the sender is.
  sender: id of the account that sent the message.
  recipient: id of the person that the message was sent to.
  message: the message itself.
 */

var senderTypes = ["church", "member"];

var messageSchema = new Schema({
    sender_name:     String,
    sender_type:     {type: String, enum: senderTypes},
    sender_church:   {type: Schema.Types.ObjectId, ref: 'Church'},
    sender_member:   {type: Schema.Types.ObjectId, ref: 'Member'},
    message:         String,
    createdAt:       Date
});

messageSchema.pre('save', function(next){
    if (!this.createdAt){
        this.createdAt = new Date();
    }
    next();
});


module.exports = messageSchema;