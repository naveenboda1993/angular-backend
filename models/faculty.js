const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

'use strict';
const facultySchema = new Schema({
  company_id: { type: Schema.Types.ObjectId, ref: 'User' },
  name: { type: String },
  email: { type: String },
  password: { type: String },
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});


facultySchema.methods.hasSamePassword = function (requestedPassword) {

  return bcrypt.compareSync(requestedPassword, this.password);
}


facultySchema.pre('save', function (next) {
  const faculty = this;

  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(faculty.password, salt, function (err, hash) {
      faculty.password = hash;
      next();
    });
  });

});

module.exports = mongoose.model('Faculty', facultySchema);