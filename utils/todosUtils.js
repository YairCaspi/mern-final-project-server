const Todos = require('../models/todoModel');

exports.getUserTodos = (userId) => {
   return Todos.find({ userId });
}
