const { normalizeErrors } = require('../helpers/mongoose');
const Course = require('../models/course');
const Faculty = require('../models/faculty');
const Subscription = require('../models/subscription');

exports.addCourse = (req, res) => {
    const {  title, description, faculty_assigned, curriculum_data, image_url } = req.body;
    const course = new Course({  title, description, faculty_assigned, curriculum_data, image_url });

    Course.find({ title: req.body.title }, function (err, data) {
        if (!data.length) {
            course.save(function (err) {
                if (err) {
                    return res.json({ 'status': 'fail',  'message': 'Error occured in adding course .Try again.' });
                }
                return res.json({ 'status': 'success', 'message': 'Course added successfully.' });
            });
        }
        else
            return res.json({ 'status': 'existed', 'message': 'Already course existed with that title.' });
    })
}


exports.getCourses = (req, res) => {
    Course.find({course_status:1}).then((data) => {
        return res.json(data);
    }).catch((err) => {
        return res.json(err);
    })
}

exports.updateCourse = (req,res)=>{
    Course.update({_id:req.body._id},req.body).then((success)=>{
        return res.json({status:'success',message:'Updated'})
    }).catch((err)=>{ return res.json(err);})
}

exports.updateCourseImage =(req,res)=>{
    Course.findById(req.params._id, function (err, course) {
        if (err) {
          return res.status(422).send({ errors: normalizeErrors(err.errors) });
        }
        if (course) {
          Course.update({ _id: req.params._id }, { image_url:req.body.image_url }, { new: true }, function (err) {
            if (err) {
              return res.status(422).send({ errors: normalizeErrors(err.errors) });
            }
            return res.status(200).send(course);
    
          });
        }
      })
}

exports.deleteCourse = (req,res)=>{
    Course.update({_id:req.params.course_id},{course_status:0}).then((success)=>{
        return res.json({status:'success',message:'Deleted Successfully'});
    }).catch((err)=>{ return res.json({status:'fail',message:err})})
}

exports.getCourseData = (req,res)=>{
    Course.findOne({_id:req.params.course_id}).then((data)=>{
        return res.json(data);
    }).catch((err)=>{ return res.json(err);})
}

exports.getCompanyCourses = (req, res) => {
    Faculty.find({company_id:req.params.company_id}).then((data)=>{
        let faculty_ids=[];
        data.forEach(faculty=>{
            faculty_ids.push(faculty._id);
        })
        Course.find({faculty_assigned:{$in:faculty_ids},course_status:1}).populate({path:'faculty_assigned',model:'Faculty'}).then((courses)=>{
            return res.json(courses);
        }).catch((err)=>{ return res.json(err)})
    }).catch((err)=>{ return res.json(err);})
}

exports.geSubscriptionList = (req,res) =>{
    Faculty.find({company_id:req.params.company_id}).then((data)=>{
        let faculty_ids=[];
        data.forEach(faculty=>{
            faculty_ids.push(faculty._id);
        })
        Course.find({faculty_assigned:{$in:faculty_ids},course_status:1}).then((courses)=>{
            let course_ids=[];
            courses.forEach(course=>{
                course_ids.push(course._id);
            })
            Subscription.find({course_id:{$in:course_ids}})
            .populate({path:'subscriber_id',model:'Subscriber'})
            .populate({path:'course_id',model:'Course'})
            .then((subscriptions)=>{
                return res.json(subscriptions);
            }).catch((err)=>{ return res.json(err);})
        }).catch((err)=>{ return res.json(err)})
    }).catch((err)=>{ return res.json(err);})
}

exports.updateSubscription = (req,res)=>{
    Subscription.update({_id:req.body.subscription_id},req.body).then(()=>{
        return res.json({status:'success',message:'updated'});
    }).catch((err)=>{ return res.json(err);})
}

exports.getFacultyCourses = (req,res)=>{
    Course.find({faculty_assigned:req.params.faculty_id,course_status:1}).then((data)=>{
        return res.json(data);
    }).catch((err)=>{ return res.json(err);})
}


exports.getFacultySubscriptions = (req,res)=>{
    Course.find({faculty_assigned:req.params.faculty_id,course_status:1}).then((courses)=>{
        let course_ids=[];
        courses.forEach(course=>{
            course_ids.push(course._id);
        })
        Subscription.find({course_id:{$in:course_ids}})
        .populate({path:'subscriber_id',model:'Subscriber'})
        .populate({path:'course_id',model:'Course'})
        .then((subscriptions)=>{
            return res.json(subscriptions);
        }).catch((err)=>{ return res.json(err);})
    }).catch((err)=>{ return res.json(err)})
}

exports.getCourseDetails = (req,res)=>{
    Course.find({_id:req.params.course_id}).then((data)=>{
        return res.json(data);
    }).catch((err)=>{ return res.json(err);})
}

// exports.addCurriculum = (req,res)=>{
//     const {  comapny_id, title, curriculum_data } = req.body;
//     const curriculum = new Curriculum({  comapny_id, title, curriculum_data });
//     curriculum.save(function(err){
//         if(err){
//             return res.json(err);
//         }
//         else
//         return res.json({status:'success',message:'Curriculum Added'})
//     })
// }

// exports.getCompanyCurriculumData = (req,res)=>{
//     Curriculum.find({company_id:req.params.comapny_id,curriculum_status:1}).then((data)=>{
//         return res.json(data);
//     }).catch((err)=>{ return res.json(err); })
// }

// exports.getUnAssignedCurriculumData = (req,res)=>{
//     Curriculum.find({company_id:req.params.comapny_id,curriculum_status:1,is_assigned:0}).then((data)=>{
//         return res.json(data);
//     }).catch((err)=>{ return res.json(err); })
// }

