const mongoose = require('mongoose');

const schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const TodoSchema = new schema({
   userId: ObjectId,
   title: String,
   completed: Boolean
});

module.exports = mongoose.model('todos', TodoSchema);
