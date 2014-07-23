/**
 * Created by Josh Pagley on 7/17/14.
 */

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

/**
 * by: ID of the account that created the like.
 * name: Name of the account that created the like.
 * ts: Date like was created.
 */

var seriesSchema = new Schema({
    owner:                      {type: Schema.Types.ObjectId, ref: 'Church', required: true},
    series_pic:                 String,
    name:                       {type: String, required: true},
    sermons:                    [{type: Schema.Types.ObjectId, ref: 'Sermon'}],
    ts:                         Date
});

seriesSchema.pre('save', function(next){
    if (!this.ts){
        this.ts = new Date();
    }
    next();
});


module.exports = mongoose.model('Series', seriesSchema);