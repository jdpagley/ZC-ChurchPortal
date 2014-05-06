/**
 * Created by Josh Pagley on 5/1/14.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

/*
member: The id of the member that checkedin.
church: The church that the member checked into.
service: The service from the list of services the church has that member attended.
day: Is a the day (1/2/2014) in a format that is easy to search.
 */

var checkInSchema = new Schema({
    member:                     {type: Schema.Types.ObjectId, ref: 'Member'},
    church:                     {type: Schema.Types.ObjectId, ref: 'Church'},
    service:                    String,
    day:                        String,
    createdAt:                  Date
});

checkInSchema.pre('save', function(next){
    if (!this.createdAt){
        this.createdAt = new Date();
    }

    if(!this.day){
        var current = new Date();
        this.day = (current.getMonth() + 1) + "/" + current.getDate() + "/" + current.getFullYear();
    }

    next();
});



module.exports = mongoose.model('Checkin', checkInSchema);