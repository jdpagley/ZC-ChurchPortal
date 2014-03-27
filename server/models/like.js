/**
 * Created by Josh Pagley on 3/12/14.
 */

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var likeSchema = new Schema({
    likeAuthor:              Schema.Types.ObjectId,
    likeRecipient:           {type: Schema.Types.ObjectId, ref: 'Post'},
    createdAt:                  Date
});

likeSchema.pre('save', function(next){
    if (!this.createdAt){
        this.createdAt = new Date();
    }

    next();
});


module.exports = mongoose.model('Like', likeSchema);