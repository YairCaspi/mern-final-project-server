const express = require('express');
const cors = require('cors')
const debug = require('debug')('server:server');
const dbStarter = require('./models/starter');
const dbStarter2 = require('./models/dbStarter');

require('./configs/mongodb');

const app = express();
const portListening = 770;

//#region Routers:

const routeUsers = require('./router/usersRouter');
const routeTodos = require('./router/todosRouter');

//#endregion

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/users', routeUsers);
app.use('/todos', routeTodos);

app.listen(portListening, () => {
   debug('start listening on port ' + portListening);
   //dbStarter.fetcAllhDataFromApi();
   setTimeout(() => {
      dbStarter2.executeStarter().then(() => {
         debug('DB was started');
      });
   }, 0);
});