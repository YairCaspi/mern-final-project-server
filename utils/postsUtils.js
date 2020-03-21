const Posts = require('../models/postsModel');

exports.getUserTodos = (userId) => {
   return Posts.find({ userId });
}
