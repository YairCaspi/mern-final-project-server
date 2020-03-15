const router = require('express').Router();
const debug = require('debug')('server:router-users');
const async = require('async');

const utils = require('../utils/userUtils');

router.route('/')
   .get((req, res) => {
      utils.getUsersListWithOpenTodosCount()
      .then(usersList => {
         res.json(usersList);
      })
      .catch(err => {
         res.json({ err });
      });
   })
   .post((req, res) => {
      const attr = req.body;
      utils.addNewUser(attr)
      .then(user => {
         res.json(user);
      })
      .catch(err => {
         debug(err);
         res.json({ err });
      });
   });

module.exports = router;