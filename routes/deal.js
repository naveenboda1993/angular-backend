const express = require('express');
const router = express.Router();
const dealController = require('../controllers/dealController');
const UserCtrl = require('../controllers/user');


router.post('/add',  dealController.adddeal);
router.post('/update',  dealController.updatedeal);

// router.get('/all',UserCtrl.authMiddleware, dealController.getCourses);
router.get('/all/:id', dealController.getdeals);

router.get('/getdeals/:company_id', dealController.getCompanydeals)


module.exports = router;