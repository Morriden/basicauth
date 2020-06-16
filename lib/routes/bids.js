const { Router } = require('express');
const { ensureAuth } = require('../middleware/authFunctions');
const Bid = require('../models/bid');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    Bid
      .findOneAndUpdate({
        price: req.body.price,
        quantity: req.body.quantity
      }, {
        user: req.user._id,
        ...req.body      
      },
      { new: true, upsert: true }
      )
      .then(bid => res.send(bid))
      .catch(next);
  })
  .get('/:id', ensureAuth, (req, res, next) => {
    Bid
      .findById(req.params.id)
      .populate('auctions')
      .populate('users')
      .then(bid => res.send(bid))
      .catch(next);
  })
  .delete('/:id', ensureAuth, (req, res, next) => {
    Bid
      .findByIdAndDelete(req.params.id)
      .then(bid => res.send(bid))
      .catch(next);
  });
