const async = require('async');

const Users = require('../models/userModel');
const Todos = require('../models/todoModel');

exports.getUsersListWithOpenTodosCount = async () => {
   return new Promise(async (resolve, reject) => {
      try {
         const usersResponse = [];
      
         // get all users list
         const users = await Users.find({});
         
         // get uncompleted todos for each user async:
         async.each(users, 
            (user, callback) => {
               // each iteration:
               Todos.find({userId: user.id})
               .then((todos) => {
                  // push user data with todos info:
                  usersResponse.push({
                     ...user.toJSON(),
                     uncompletedTodosCount: todos.length
                  });
                  callback();
               });
            },
            (finishErr) => {
               //finish async loop:
               if (finishErr) {
                  reject(finishErr);
               } else {
                  resolve(usersResponse);
               }
            }
         );
      } catch (err) {
         reject(err);
      }
   });
}

exports.addNewUser = (attr) => {
   return new Promise((resolve, reject) => {
      const newUser = new Users(attr);
      newUser.save()
      .then((data) => {
         resolve(data);
      })
      .catch((err) => {
         reject(err);
      });
   });
}

exports.deleteUser = (userId) => {
   return Users.findByIdAndRemove(userId);
}
