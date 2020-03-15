const axios = require('axios').default;
const async = require('async');
const debug = require('debug')('server:db-starter-yair');
const Users = require('./userModel');
const Todos = require('./todoModel');
const Posts = require('./postsModel');

const MAIN_URL = 'https://jsonplaceholder.typicode.com/';

exports.executeStarter = () => {
   return new Promise(async(resolve, reject) => {
      const countUsers = await Users.countDocuments();
      if (countUsers > 0) {
         resolve('Already have data');
      } else {
         try {
            const users = await axios.get(MAIN_URL + 'users');
            const todos = await axios.get(MAIN_URL + 'todos');
            const posts = await axios.get(MAIN_URL + 'posts');

            debug('get all data [users, todos, posts]');
            users.data.forEach((user) => {
               const userTodos = todos.data.filter(t => user.id === t.userId);
               const userPosts = posts.data.filter(p => user.id === p.userId);

               user.todos = userTodos;
               user.posts = userPosts;
            });

            async.each(users.data, (user, callback) => {
               const newUser = new Users({
                  name: user.name,
                  email: user.email,
                  city: user.address.city,
                  street: user.address.street,
                  zipCode: user.address.zipcode,
               });
               newUser.save()
               .then(async (saveData) => {
                  user.dbId = saveData.id;
                  await saveUserItems(saveData.id, user.todos, (todo) => {
                     const newTodo = new Todos({
                        userId: todo.userId,
                        title: todo.title,
                        completed: todo.completed || false
                     });
                     return newTodo.save();
                  });
                  await saveUserItems(saveData.id, user.posts, (post) => {
                     const newPost = new Posts({
                        userId: post.userId,
                        title: post.title,
                        body: post.body
                     })
                     return newPost.save();
                  });
                  debug(`save ${newUser.name} and his items`);
                  callback();
               });
            }, (errorOnFinish) => {
               if (errorOnFinish) {
                  reject(errorOnFinish);
               } else {
                  resolve();
               }
            })
         } catch(error) {
            debug(error);
            reject(error)
         }
      }
   });
}

const saveUserItems = (userId, items, saveFunc) => {
   return new Promise((resolve, reject) => {
      async.each(items, (item, callback) => {
         item.userId = userId;
         saveFunc(item).then(() => {
            callback();
         }).catch(e => {
            debug(e);
            callback();
         });
      }, (endError) => {
         if (endError) {
            reject(endError);
         } else {
            resolve();
         }
      });
   });
}

const fetchData = (urlSuffix, countFunc, saveObjectFunc) => {
   return new Promise(async (resolve, reject) => {
      try {
         const rows = await countFunc();
         if (rows > 0) {
            debug('%s already fetched (have %d users in db)', urlSuffix, rows);
            resolve('Already exist');
         } else {
            const response = await axios.get(MAIN_URL + urlSuffix);
            if (response.status !== 200) {
               debug('fetch %s faild with status %d', urlSuffix, response.status);
               reject('Faild with status ' + response.status);
            } else {
               async.forEachOf(response.data, (item, index, callback) => {
                  const dbItem = saveObjectFunc(item, index);
                  dbItem.save().then(() => {
                     callback();
                  });
               }, (finishErr) => {
                  if (finishErr) {
                     reject(finishErr);
                  } else {
                     resolve('Success');
                  }
               });
            }
         }
      } catch (err) {
         reject(err);
      }
   });
};
