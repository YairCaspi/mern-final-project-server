const router = require('express').Router();
const debug = require('debug')('server:router-todos');

const todos = require('../models/todoModel');

router.route('/:userId')
   .get((req, res) => {
      const userId = req.params.userId;
      todos.find({ userId })
      .then(todosList => {
         res.json(todosList);
      })
      .catch(e => {
         debug(e);
         res.json(e);
      });
   })

module.exports = router;
