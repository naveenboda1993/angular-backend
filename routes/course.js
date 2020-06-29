const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const subscriberController = require('../controllers/subscriberController');
const UserCtrl = require('../controllers/user');


router.post('/add', UserCtrl.authMiddleware, courseController.addCourse);

router.get('/all',UserCtrl.authMiddleware, courseController.getCourses);

router.get('/getcourses/:company_id',UserCtrl.authMiddleware, courseController.getCompanyCourses);

router.put('/update', UserCtrl.authMiddleware, courseController.updateCourse);

router.put('/update_image/:_id', UserCtrl.authMiddleware, courseController.updateCourseImage);

router.get('/getData/:course_id', UserCtrl.authMiddleware, courseController.getCourseData);

router.delete('/delete/:course_id', UserCtrl.authMiddleware, courseController.deleteCourse);

router.get('/getSubscriptionList/:company_id', UserCtrl.authMiddleware, courseController.geSubscriptionList);

router.put('/updateSubscription', UserCtrl.authMiddleware, courseController.updateSubscription);

router.get('/getFacultyCourses/:faculty_id', UserCtrl.authMiddleware, courseController.getFacultyCourses);

router.get('/getFacultySubscriptions/:faculty_id', UserCtrl.authMiddleware, courseController.getFacultySubscriptions);



router.get('/getCourseDetails/:course_id',UserCtrl.authMiddleware,courseController.getCourseDetails);


// router.post('/create_curriculum', UserCtrl.authMiddleware, courseController.addCurriculum);

// router.get('/getCompanyCurriculumData/:company_id', UserCtrl.authMiddleware, courseController.getCompanyCurriculumData);

// router.get('/getUnAssignedCurriculumData/:company_id', UserCtrl.authMiddleware, courseController.getUnAssignedCurriculumData);

module.exports = router;