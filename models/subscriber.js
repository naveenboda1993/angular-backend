const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

'use strict';
const subscriberSchema = new Schema({
  company_id: { type: Schema.Types.ObjectId, ref: 'User' },
  first_name: { type: String },
  last_name: { type: String },
  email: { type: String },
  mobile: { type: String },
  password: { type: String },
  address: { type: String },
  createdAt: { type: Date, default: Date.now }
});


subscriberSchema.methods.hasSamePassword = function (requestedPassword) {

  return bcrypt.compareSync(requestedPassword, this.password);
}


subscriberSchema.pre('save', function (next) {
  const subscriber = this;

  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(subscriber.password, salt, function (err, hash) {
      subscriber.password = hash;
      next();
    });
  });

});

module.exports = mongoose.model('Subscriber', subscriberSchema);