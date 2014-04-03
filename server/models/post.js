/**
 * Created by Josh Pagley on 2/26/14.
 */

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var authorTypes = ['church', 'member'];

var postSchema = new Schema({
    authorType:                 {type: String, enum: authorTypes},
    postAuthor:                 Schema.Types.ObjectId,
    postRecipient:              {type: Schema.Types.objectId, ref: 'Church'},
    comments:                   [{type: Schema.Types.ObjectId, ref: 'Comment'}],
    likes:                      [{type: Schema.Types.ObjectId, ref: 'Like'}],
    message:                    String,
    createdAt:                  Date,
    updatedAt:                  Date
});

postSchema.pre('save', function(next){
    this.updatedAt = new Date();
    if (!this.createdAt){
        this.createdAt = new Date();
    }

    next();
});


module.exports = mongoose.model('Post', postSchema);