const express = require('express');
const UserController = require('../controllers/user');
const router = express.Router();
const User = require('../models/user');
const { normalizeErrors } = require('../helpers/mongoose');
const UserCtrl = require('../controllers/user');


router.post('/superadminregister', UserController.superadminregister);

router.post('/superadminlogin', UserController.superadminlogin);

router.post('/updatePasswordforSuperAdmin', UserController.updatePasswordforSuperAdmin);

router.get('/getUsersForSuperAdmin', function (req, res) {
  User.find({}, { bookings: 0, createdAt: 0, password: 0, rentals: 0, __v: 0 }, function (err, data) {
    if (err) {
      return res.status(422).send({ errors: normalizeErrors(err.errors) });
    }
    return res.json(data);
  });
});

router.post('/updateUserStatus', UserCtrl.authMiddleware, function (req, res) {
  User.findById(req.body._id, function (err, data) {
    if (err) {
      return res.status(422).send({ errors: normalizeErrors(err.errors) });
    }
    if (data) {
      console.log(req.body)
      User.update({ _id: req.body._id }, req.body, { new: true }, function (err) {
        if (err) {
          return res.json({ 'status': true, 'type': 'error', 'message': 'Error occured please try again.' });
        }
        return res.json({ 'status': true, 'type': 'success', 'message': 'Upadated successfully' })
      });
    }
  })
});

router.get('/getUsersCount', function (req, res) {
  User.count()
    .exec(function (err, count) {

      if (err) {
        return res.status(422).send({ errors: normalizeErrors(err.errors) });
      }

      return res.json(count);
    });
});



router.get('/getUsersForFreetrialActiveInactive', function (req, res) {
  User.find(function (err, result) {
    if (err) {
      return res.status(422).send({ errors: normalizeErrors(err.errors) });
    }
    return res.json(result);
    console.log(result)
  })
});


module.exports = router;


