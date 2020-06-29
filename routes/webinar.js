const express = require('express');
const router = express.Router();
const webinarController = require('../controllers/webinarController');
const UserCtrl = require('../controllers/user');


router.post('/add',  webinarController.addwebinar);
// router.post('/update',  dealController.updatedeal);

// router.get('/all',UserCtrl.authMiddleware, dealController.getCourses);
router.get('/all/:id', webinarController.getwebiners);

// router.get('/getdeals/:company_id', dealController.getCompanydeals)


module.exports = router;