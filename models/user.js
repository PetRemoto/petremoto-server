var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

// define the schema for our user model
var userSchema = new mongoose.Schema({
    username: { type: String, trim: true, required: true, lowercase: true, minlength: 5, maxlength: 40, unique: true},
    firstname: {type: String, trim: true, required: true, lowercase: true, minlength: 5, maxlength: 40},
    lastname: {type: String, trim: true, required: true, lowercase: true, minlength: 5, maxlength: 40},
    password: { type: String, trim: true, required: true, minlength: 5, maxlength: 40},
    email: { type: String, trim: true, required: true, lowercase: true, minlength: 5, maxlength: 40, unique: true},
    dispensers: [
        {type: mongoose.Schema.ObjectId, ref: 'Dispenser'}
    ]
});

// Apply the uniqueValidator plugin to userSchema.
userSchema.plugin(uniqueValidator);

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);