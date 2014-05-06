/**
 * Created by Josh Pagley on 5/2/14.
 */

var mongoose = require("mongoose");
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var memberSchema = new Schema({
    name:                     String,
    email:                    {type: String, unique: true, required: true},
    password:                 {type: String, required: true},
    address:                  {
        street:               String,
        city:                 String,
        state:                String,
        zip:                  String
    },
    phone:                    String,
    birthday:                 String,
    gender:                   String,
    relationshipStatus:       String,
    bio:                      String,
    createdAt:                Date,
    UpdatedAt:                Date
});

memberSchema.pre('save', function(next){
    this.updatedAt = new Date();
    if (!this.createdAt){
        this.createdAt = new Date();
    }

    next();
});

// methods ===========================

// generating a hash
memberSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

//checking if password is valid
memberSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('Member', memberSchema);