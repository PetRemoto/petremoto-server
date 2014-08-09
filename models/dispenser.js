var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

function validatorEnum(v) {
  return  (v == 'EMPTY' || v == 'OFFLINE' || v == 'ALMOST_EMPTY' || v == 'NORMAL' || v == 'BLOCKED');
};

// define the schema for our user model
var dispenserSchema = new mongoose.Schema({
    serial: { type: String, trim: true, required: true, uppercase: true, unique: true},
    name: { type: String, trim: true, required: true},
    status: { type: String, default: 'OFFLINE', uppercase: true, validate: [validatorEnum, 'my error type'] },
    feed: { type: Boolean, default: false },
    last_time_fed: { type: Date, default: Date.now },
    last_time_check: { type: Date, default: Date.now }
});

// Apply the uniqueValidator plugin to userSchema.
dispenserSchema.plugin(uniqueValidator);

// create the model for users and expose it to our app
module.exports = mongoose.model('Dispenser', dispenserSchema);