/**
 * Created by Josh Pagley on 5/15/14.
 * Description: Used for messages array in
 * conversation schema.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

/*
  sender_name: name of the account that sent the message.
  sender: id of the account that sent the message.
  message: the message itself.
 */

var messageSchema = new Schema({
    name:            String,
    sender:          {type: Schema.Types.ObjectId, ref: 'Member'},
    msg:             String,
    ts:              Date
});

messageSchema.pre('save', function(next){
    if (!this.ts){
        this.ts = new Date();
    }
    next();
});


module.exports = messageSchema;