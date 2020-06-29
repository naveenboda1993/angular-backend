const { normalizeErrors } = require('../helpers/mongoose');
const Subscriber = require('../models/subscriber');
const Subscription = require('../models/subscription');
const jwt = require('jsonwebtoken');
const config = require('../config');
const Studentcoursestatus = require('../models/studentcoursestatus');

exports.addSubscriber = (req, res) => {
    const { company_id, first_name, last_name, email, mobile, password, address } = req.body;
    const subscriber = new Subscriber({ company_id, first_name, last_name, email, mobile, password, address });

    Subscriber.find({ email: req.body.email }, function (err, data) {
        if (!data.length) {
            subscriber.save(function (err) {
                if (err) {
                    return res.json({ 'status': true, 'type': 'error', 'message': 'Error occured in adding subscriber .Try again.' });
                }
                return res.json({ 'status': true, 'type': 'success', 'message': 'Subscriber added successfully.' });
            });
        }
        else
            return res.json({ 'status': true, 'type': 'existed', 'message': 'Already subscriber existed with that email.' });
    })
}

// exports.getFaculty = (req,res) => {
//     Faculty.find({company_id:req.params.company_id}).then((data)=>{
//         return res.json(data);
//     }).catch((err)=>{
//         return res.json(err);
//     })
// }


exports.subscriberLogin = (req,res) =>{
    const { email, password } = req.body;

  if (!password || !email) {
    return res.status(422).send({ errors: [{ title: 'Data missing!', detail: 'Provide email and password!' }] });
  }

  Subscriber.findOne({ email }, function (err, subscriber) {
    if (err) {
      return res.status(422).send({ errors: normalizeErrors(err.errors) });
    }
    if (!subscriber) {
      return res.status(422).send({ errors: [{ title: 'Invalid Subscriber!', detail: 'Subscriber does not exist' }] });
    }

    if (subscriber.hasSamePassword(password)) {
        const token = jwt.sign({
        userId: subscriber.id,
        email: subscriber.email,
        role: 'parent'
      }, config.SECRET, { expiresIn: '1h' });

      return res.json(token);
    } else {
      return res.status(422).send({ errors: [{ title: 'Wrong Data!', detail: 'Wrong email or password' }] });
    }
  });
}

exports.subscribeToCourse = (req,res) =>{
    const { subscriber_id, course_id } = req.body;
    const subscription = new Subscription({ subscriber_id, course_id });
    Subscription.find({subscriber_id:req.body.subscriber_id,course_id:req.body.course_id}).then((data)=>{
      if(!data.length){
        subscription.save(function(err){
          if(err){
            return res.json(err);
          }
          else 
          return res.json({status:'success',message:'Subscribed to Course successfully'})
        })
      }
      else
      return res.json({status:'success',message:'Already subscribed to this course'});
    })
}

exports.getMyCourses =(req,res)=>{
  Subscription.find({subscriber_id:req.params.subscriber_id})
  .populate({path:'course_id',model:'Course'})
  .populate({path:'subscription_approved_by'})
  .then((data)=>{
    return res.json(data);
  }).catch((err)=>{ return res.json(err); })
}

exports.studentcoursestatus = (req,res)=>{
  Studentcoursestatus.findOne({student_id:req.body.student_id,course_id:req.body.course_id,curriculum_id:req.body.curriculum_id}).then((data)=>{
    if(data){
      Studentcoursestatus.update({student_id:req.body.student_id,course_id:req.body.course_id,curriculum_id:req.body.curriculum_id},{updatedAt:new Date()}).then((success)=>{
        return res.json({status:'success',message:'Curriculum status updated'});
      }).catch((err)=>{return res.json({status:'fail',message:err});})
    }
    if(!data){
      const { student_id,course_id,curriculum_id, } = req.body;
      const studentcoursestatus = new Studentcoursestatus({ student_id,course_id,curriculum_id });
      studentcoursestatus.save(function(err){
        if (err) {
          return res.json({ 'status': 'fail',  'message': err });
        }
        return res.json({ 'status': 'success', 'message': 'Status added successfully.' });
      })
    }
  }).catch((err)=>{return res.json({status:'fail',message:err});})
}

exports.getStudentCirriculumStatus =(req,res)=>{
  Studentcoursestatus.find({student_id:req.body.student_id,course_id:req.body.course_id}).then((data)=>{
    return res.json({status:'success',message:'Date fetch success',data:data})
  }).catch((err)=>{ return res.json({ 'status': 'fail',  'message': err })})
}