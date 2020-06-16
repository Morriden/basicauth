const mongoose = require('mongoose');

const bids = new mongoose.Schema({
  auction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auction',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  quantity: {
    type: Number,
    required: true,
    ming: 1,
    default: 1
  },
  accepted: {
    type: Boolean,
  }
}, {
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.id;
      delete ret.__v;
    }
  }
});

module.exports = mongoose.model('Bid', bids);
