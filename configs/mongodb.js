const mongoose = require('mongoose');
const debug = require('debug')('server:mongo-config');

mongoose.connect('mongodb://localhost:27017/MERN_Yaniv', {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   useFindAndModify: false,
}).then(() => {
   debug('db connect successfuly');
}).catch(e => {
   debug('Failed. ', e)
});


