const axios = require('axios').default;
const async = require('async');
const { User, utils: userUtils } = require('./userModel');
const { Todo, utils: todoUtils} = require('./todoModel');
const debug = require('debug')('server:db-starter');

const MAIN_URL = 'https://jsonplaceholder.typicode.com/';

exports.fetcAllhDataFromApi = async () => {
   const usersStatus = await fetchData('users', userUtils.count, (user) => {
      return new User({
         id: user.id,
         name: user.name,
         email: user.email
      });
   });

   const todosStatus = await fetchData('todos', todoUtils.count, (todo) => {
      return new Todo({
         userId: todo.userId,
         title: todo.title,
         completed: todo.completed
      });
   });

   debug('load Users from API: %s', usersStatus);
   debug('load Todos from API: %s', todosStatus);

}

const fetchData = (urlSuffix, countFunc, getDbObjectMiddleware) => {
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
                  const dbItem = getDbObjectMiddleware(item, index);
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
