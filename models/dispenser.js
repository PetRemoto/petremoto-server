var mongoose = require('mongoose');

// define the schema for our user model
var dispenserSchema = new mongoose.Schema({
  serial: { type: String, trim: true, required: true, minlength: 20, maxlength: 20}
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Dispenser', dispenserSchema);