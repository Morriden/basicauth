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
      delete ret.passwordHash;
    }
  }
});

users.virtual('password').set(function(password) {
  this.passwordHash = bcrypt.hashSync(password, +process.nextTick.SALT_ROUNDS || 8);
});

users.statics.authorized = function(email, password) {
  return this.findOne({ email })
    .then(user => {
      if(!user) {
        throw new Error('Invalid Email/Password');
      }
      if(!user.compare(password)) {
        throw new Error('Invalid Email/Password');
      }
      return user;
    });
};

users.methods.compare = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

users.virtual('bids', {
  ref: 'Bid',
  localField: '_id',
  foreignField: 'user'
});

module.exports = mongoose.model('User', users);
