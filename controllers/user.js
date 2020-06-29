const User = require('../models/user');
const { normalizeErrors } = require('../helpers/mongoose');
const jwt = require('jsonwebtoken');
const config = require('../config');
const bcrypt = require('bcryptjs');
const Superadmin=require('../models/superadmin');
const Subscriber = require('../models/subscriber');
const Faculty = require('../models/faculty');


exports.getCompanyDetails =(req,res)=>{
  User.findById(req.params._id).then((data)=>{
    return res.json(data);
  }).catch((err)=>{ return res.json(err);})
}

exports.auth = function (req, res) {
  const { email, password } = req.body;

  if (!password || !email) {
    return res.status(422).send({ errors: [{ title: 'Data missing!', detail: 'Provide email and password!' }] });
  }

  User.findOne({ email }, function (err, user) {
    if (err) {
      return res.status(422).send({ errors: normalizeErrors(err.errors) });
    }

    if (!user) {
      return res.status(422).send({ errors: [{ title: 'Invalid User!', detail: 'User does not exist' }] });
    }

    if (user.hasSamePassword(password)) {
      if(user.status=="active" || user.status=="FreeTrial"){
        const token = jwt.sign({
        userId: user.id,
        username: user.username,
        instituteaddress: user.instituteaddress,
        status:user.status,
        role: 'admin',
        acc_year: user.acc_year,
      }, config.SECRET, { expiresIn: '1h' });

      return res.json(token);
      }
      else{
        return res.status(422).send({ errors: [{ title: 'Wrong Data!', detail: 'Your subscription plan has ended' }] });
      }
    } else {
      return res.status(422).send({ errors: [{ title: 'Wrong Data!', detail: 'Wrong email or password' }] });
    }
  });
}

exports.register = function (req, res) {
  const { username, email, instituteaddress, password, passwordConfirmation, institutephone, institutemobile, institutefax, institutecontactperson, institutecountry, institutecurrency, institutelanguage, institutecode, image, fromdate, todate, noofstudents } = req.body;

  if (!password || !email) {
    return res.status(422).send({ errors: [{ title: 'Data missing!', detail: 'Provide fullname, email and password!' }] });
  }

  if (password !== passwordConfirmation) {
    return res.status(422).send({ errors: [{ title: 'Invalid passsword!', detail: 'Password is not a same as confirmation!' }] });
  }

  User.findOne({ email }, function (err, existingUser) {
    if (err) {
      return res.status(422).send({ errors: normalizeErrors(err.errors) });
    }

    if (existingUser) {
      return res.status(422).send({ errors: [{ title: 'Invalid email!', detail: 'User with this email already exist!' }] });
    }

    const user = new User({
      username,
      email,
      instituteaddress,
      password,
      institutephone,
      institutemobile,
      institutefax,
      institutecontactperson,
      institutecountry,
      institutecurrency,
      institutelanguage,
      institutecode,
      noofstudents,
      image,
      fromdate,
      todate
    });

    user.save(function (err) {
      if (err) {
        return res.status(422).send({ errors: normalizeErrors(err.errors) });
      }

      return res.json({ 'registered': true });
    })
  })
}

exports.authMiddleware = async function (req, res, next) {
  const token = req.headers.authorization;

  if (token) {
    const user = await parseToken(token);
    console.log('>>>>>>>>>>>>> user ', user)
    if (user) {
      if (user.role === 'admin') {
        // check in User
        User.findById(user.userId, function (err, user) {
        if (err) {
          return res.status(422).send({ errors: normalizeErrors(err.errors) });
        }
        if (user) {
          res.locals.user = user;
          next();
        } else {
          return notAuthorized(res);
        }
      })
      } else if (user.role === 'teacher') {
        // check in Staff
        Faculty.findById(user.userId, function (err, user) {
        if (err) {
          return res.status(422).send({ errors: normalizeErrors(err.errors) });
        }
        if (user) {
          res.locals.user = user;
          next();
        } else {
          return notAuthorized(res);
        }
      })
      } else if (user.role === 'parent') {
        // check in Student
        Subscriber.findById(user.userId, function (err, user) {
        if (err) {
          return res.status(422).send({ errors: normalizeErrors(err.errors) });
        }
        if (user) {
          res.locals.user = user;
          next();
        } else {
          return notAuthorized(res);
        }
      })
      }
      else if (user.role === 'superadmin') {
        // check in Student
        Superadmin.findById(user.userId, function (err, user) {
        if (err) {
          return res.status(422).send({ errors: normalizeErrors(err.errors) });
        }
        if (user) {
          res.locals.user = user;
          next();
        } else {
          return notAuthorized(res);
        }
      })
      }
    } else {
      res.status(401).send({ errors: [{ title: 'Not authorized!', detail: 'You need to login to get access!' }] });
    }

  } else {
    return notAuthorized(res);
  }
}


exports.superadminregister = function (req, res) {
  const { username, email, password, passwordConfirmation,} = req.body;

  if (!password || !email) {
    return res.status(422).send({ errors: [{ title: 'Data missing!', detail: 'Provide fullname, email and password!' }] });
  }

  if (password !== passwordConfirmation) {
    return res.status(422).send({ errors: [{ title: 'Invalid passsword!', detail: 'Password is not a same as confirmation!' }] });
  }

  Superadmin.findOne({ email }, function (err, existingUser) {
    if (err) {
      return res.status(422).send({ errors: normalizeErrors(err.errors) });
    }

    if (existingUser) {
      return res.status(422).send({ errors: [{ title: 'Invalid email!', detail: 'User with this email already exist!' }] });
    }

    const superadmin = new Superadmin({
      username,
      email,
      password,
    });

    superadmin.save(function (err) {
      if (err) {
        return res.status(422).send({ errors: normalizeErrors(err.errors) });
      }

      return res.json({ 'registered': true });
    })
  })
}


exports.superadminlogin = function (req, res) {
  const { email, password } = req.body;

  if (!password || !email) {
    return res.status(422).send({ errors: [{ title: 'Data missing!', detail: 'Provide email and password!' }] });
  }

  Superadmin.findOne({ email }, function (err, user) {
    if (err) {
      return res.status(422).send({ errors: normalizeErrors(err.errors) });
    }

    if (!user) {
      return res.status(422).send({ errors: [{ title: 'Invalid User!', detail: 'User does not exist' }] });
    }

    if (user.hasSamePassword(password)) {
      const token = jwt.sign({
        userId: user.id,
        username: user.username,
        role: 'superadmin'
      }, config.SECRET, { expiresIn: '1h' });

      return res.json(token);
    } else {
      return res.status(422).send({ errors: [{ title: 'Wrong Data!', detail: 'Wrong email or password' }] });
    }
  });
}

exports.updatePasswordforSuperAdmin= function (req, res) {
  console.log(req.body);

  Superadmin.findById(req.body._id, function (err, staff) {
    if (err) {
      return res.status(422).send({ errors: normalizeErrors(err.errors) });
    }
    if (staff) {
      
      bcrypt.hash(req.body.password,10).then(function(hash) {
      Superadmin.update({ _id: req.body._id }, {password:hash}, { new: true }, function (err) {
        if (err) {
          return res.json({'status':true, 'type':'error', 'message':'Error occured. Please try again'});
        }
        return res.json({'status':true, 'type':'success', 'message':'Password updated successfully'});
      });
});;
    }
  })
};

function parseToken(token) {
  var type;
  jwt.verify(token.split(' ')[1], config.SECRET, function (err, decoded) {
    if (!err) {
      type = decoded;
    } else {
      type = false;
    }
  });
  return type;
}

function notAuthorized(res) {
  return res.status(401).send({ errors: [{ title: 'Not authorized!', detail: 'You need to login to get access!' }] });
}

