var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

// define the schema for our user model
var dispenserSchema = new mongoose.Schema({
    serial: { type: String, trim: true, required: true, lowercase: true, unique: true},
    status: { type: String, enum: ['EMPTY', 'ALMOST_EMPTY', 'BLOCKED', 'NORMAL', 'OFFLINE', 'UNAVAIABLE'], default: 'OFFLINE' },
    feed: { type: Boolean, default: false },
    last_time_feed: { type: Date, default: Date.now },
    last_time_check: { type: Date, default: Date.now }
});

// Apply the uniqueValidator plugin to userSchema.
dispenserSchema.plugin(uniqueValidator);

// create the model for users and expose it to our app
module.exports = mongoose.model('Dispenser', dispenserSchema);