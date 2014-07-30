/**
 * Created by Josh Pagley on 7/28/14.
 */

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Sub document Schemas
var messageSchema = require('./message.js');

var messagePageSchema = new Schema({
    node_id:            {type: Schema.Types.ObjectId, ref: 'Post'},
    page:               Number,
    count:              Number,
    messages:          [messageSchema]
});

module.exports = mongoose.model('Message_Page', messagePageSchema);