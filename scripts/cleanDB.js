const mongoose = require('mongoose');

const User = require('../models/userModel');
const Todo = require('../models/todoModel');
const Post = require('../models/postsModel');
mongoose.connect('mongodb://localhost:27017/MERN_Yaniv', {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   useFindAndModify: false,
   poolSize: 4,
}).then(async () => {
   console.log('db connect successfuly');

   const resUsers = await User.deleteMany({});
   console.log(resUsers);

   const resTodos = await Todo.deleteMany({});
   console.log(resTodos);
   
   const resPosts = await Post.deleteMany({});
   console.log(resPosts);
   process.exit(0);
}).catch(e => {
   console.log('Failed. ', e);
   process.exit(0);
});
