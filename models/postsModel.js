const mongoose = require('mongoose');

const schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const PostSchema = new schema({
   userId: ObjectId,
   title: String,
   body: String
});

module.exports = mongoose.model('posts', PostSchema);
