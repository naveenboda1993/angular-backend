const { normalizeErrors } = require('../helpers/mongoose');
const Webinar = require('../models/webinar');

exports.addwebinar = (req, res) => {
    console.log(req.body);
    const link="https://econnecting-video.herokuapp.com/?room="+req.body.title;
    var users=[];
    req.body.subscriber.forEach(user => {
        users.push({'user':user});
    });
     const{ title, description, date, time, createdOn, updatedOn, createdBy,   company, imgurl } = req.body
     new Webinar({ title, description, date, createdOn, createdBy,  company, imgurl, time, link,users}).save(function(err){
         if(err){
             return res.json({ 'status': false, 'type': 'error', 'message': 'Error Occured in Adding Webinar. Try again '+err});
         }
          return res.json({ 'status': true, 'type': 'error', 'message': 'Webinar added successfully.'});
     });
}

exports.getwebiners = (req, res) => {
    Webinar.find({createdBy: req.params.id}).then((data) => {
        return res.json(data);
    }).catch((err) => {
        return res.json(err);
    })
}





