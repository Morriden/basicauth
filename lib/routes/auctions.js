const { Router } = require('express');
const { ensureAuth } = require('../middleware/authFunctions');
const Auction = require('../models/auction');

module.exports = Router()
  .post('/create', ensureAuth, (req, res, next) => {
    Auction
      .create({
        user: req.user._id,
        ...req.body
      })
      .then(auction => res.send(auction))
      .catch(next);
  })
  .get('/:id', ensureAuth, (req, res, next) => {
    Auction
      .findById(req.params.id)
      .populate('users')
      .populate('bids')
      .then(auction => res.send(auction))
      .catch(next);
  })
  .get('/', ensureAuth, (req, res, next) => {
    Auction
      .find(req.query)
      .select({
        title: true
      })
      .then(auction => res.send(auction))
      .catch(next);
  });
