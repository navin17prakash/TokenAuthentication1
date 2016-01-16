var mongoose =require('mongoose');

var schema = new mongoose.Schema({
    name :String,
    password :String,
    admin : Boolean
});

module.exports.userModel = schema;