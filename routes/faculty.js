const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/facultyController');
const UserCtrl = require('../controllers/user');


router.post('/add', UserCtrl.authMiddleware, facultyController.addFaculty);

router.get('/getfaculty/:company_id',UserCtrl.authMiddleware, facultyController.getFaculty);

router.post('/login', facultyController.facultyLogin);

module.exports = router;