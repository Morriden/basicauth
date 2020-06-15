const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const auctions = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  endDate: {
    type: Date,
    required: true
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

module.exports = mongoose.model('Auction', auctions);
