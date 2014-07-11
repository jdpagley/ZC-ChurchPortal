/**
 * Created by Josh Pagley on 3/12/14.
 */

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

/**
 * by: ID of the account that created the like.
 * name: Name of the account that created the like.
 * ts: Date like was created.
 */

var likeSchema = new Schema({
    by:                      {type: Schema.Types.ObjectId, ref: 'Member'},
    name:                    String,
    ts:                      Date
});

likeSchema.pre('save', function(next){
    if (!this.ts){
        this.ts = new Date();
    }
    next();
});


module.exports = likeSchema;