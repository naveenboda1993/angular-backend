const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    min: [4, 'Too short, min is 4 characters'],
    max: [32, 'Too long, max is 32 characters'],
    required: 'Username is required',
  },
  email: {
    type: String,
    min: [4, 'Too short, min is 4 characters'],
    max: [32, 'Too long, max is 32 characters'],
    unique: true,
    lowercase: true,
    required: 'Email is required',
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
  },
  instituteaddress: {
    type: String,
    min: [4, 'Too short, min is 4 characters'],
    max: [320, 'Too long, max is 320 characters']
  },
  password: {
    type: String,
    min: [4, 'Too short, min is 4 characters'],
    max: [32, 'Too long, max is 32 characters'],
    required: 'Password is required'
  },
  institutephone: {
    type: String,
    min: [4, 'Too short, min is 4 characters'],
    max: [32, 'Too long, max is 32 characters']
  },
  institutemobile: {
    type: String,
    min: [4, 'Too short, min is 4 characters'],
    max: [32, 'Too long, max is 32 characters']
  },
  institutefax: {
    type: String,
    min: [4, 'Too short, min is 4 characters'],
    max: [32, 'Too long, max is 32 characters']
  },
  institutecontactperson: {
    type: String,
    min: [4, 'Too short, min is 4 characters'],
    max: [32, 'Too long, max is 32 characters']
  },
  institutecountry: {
    type: String,
    min: [4, 'Too short, min is 4 characters'],
    max: [32, 'Too long, max is 32 characters']
  },
  institutecurrency: {
    type: String,
    min: [4, 'Too short, min is 4 characters'],
    max: [32, 'Too long, max is 32 characters']
  },
  institutelanguage: {
    type: String,
    min: [4, 'Too short, min is 4 characters'],
    max: [32, 'Too long, max is 32 characters']
  },
  institutecode: {
    type: Number
  },
  noofstudents: {
    type: Number,
    min: [1, 'Too short, min is 1 characters'],
    max: [3000, 'Too long, max is 3000 characters']
  },
  status: {
    type: String,
    default:'inactive'
  },
  fromdate:{type: String},
  todate:{type: String},
  image: String,
  acc_year:String,
  stripeCustomerId: String,
  revenue: Number,
  createdAt: { type: Date, default: Date.now }
});

userSchema.methods.hasSamePassword = function(requestedPassword) {

  return bcrypt.compareSync(requestedPassword, this.password);
}


userSchema.pre('save', function(next) {
  const user = this;

  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
        user.password = hash;
        next();
    });
  });
});

module.exports = mongoose.model('User', userSchema );
