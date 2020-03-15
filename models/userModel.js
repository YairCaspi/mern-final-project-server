const mongoose = require('mongoose');

const schema = mongoose.Schema;

const UserSchema = new schema({
   name: String,
   email: String,
   city: String,
   street: String,
   zipCode: String,
});

module.exports = mongoose.model('users', UserSchema);
