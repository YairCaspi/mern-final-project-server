const router = require('express').Router();
const debug = require('debug')('server:router-users');
const async = require('async');

const utilsUsers = require('../utils/userUtils');
const utilsTodos = require('../utils/todosUtils');
const utilsPosts = require('../utils/postsUtils');

router.route('/')
   .get((req, res) => {
      utilsUsers.getUsersListWithOpenTodosCount()
      .then(usersList => {
         res.json(usersList);
      })
      .catch(err => {
         res.json({ err });
      });
   })

   .post((req, res) => {
      const attr = req.body;
      utilsUsers.addNewUser(attr)
      .then(user => {
         res.json(user);
      })
      .catch(err => {
         debug(err);
         res.json({ err });
      });
   })

router.route('/:userId')

   .delete((req, res) => {
      const userId = req.params.userId;
      utilsUsers.deleteUser(userId).then((data) => {
         debug(data);
         res.json('ok');
      })
      .catch(e => {
         res.json(e);
      })
   })


module.exports = router;