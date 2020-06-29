const express = require('express');
const router = express.Router();
const subscriberController = require('../controllers/subscriberController');
const UserCtrl = require('../controllers/user');


router.post('/add',  subscriberController.addSubscriber);

// router.get('/getfaculty/:company_id',UserCtrl.authMiddleware, facultyController.getFaculty);

router.post('/login', subscriberController.subscriberLogin);

router.post('/subscribe', UserCtrl.authMiddleware, subscriberController.subscribeToCourse);

router.get('/my_courses/:subscriber_id', UserCtrl.authMiddleware, subscriberController.getMyCourses);

router.post('/studentcoursestatus', UserCtrl.authMiddleware, subscriberController.studentcoursestatus);

router.post('/getStudentCirriculumStatus', UserCtrl.authMiddleware, subscriberController.getStudentCirriculumStatus);

module.exports = router;