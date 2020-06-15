const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const users = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  }
}, {
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.id;
      delete ret.__v;
      delete ret.passwordHashl;
    }
  }
});

module.exports = mongoose.model('User', users);
