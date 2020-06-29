const { normalizeErrors } = require('../helpers/mongoose');
const Faculty = require('../models/faculty');
const jwt = require('jsonwebtoken');
const config = require('../config');

exports.addFaculty = (req, res) => {
    const { company_id, name, email, password, description } = req.body;
    const faculty = new Faculty({ company_id, name, email, password, description });

    Faculty.find({ email: req.body.email }, function (err, data) {
        if (!data.length) {
            faculty.save(function (err) {
                if (err) {
                    return res.json({ 'status': true, 'type': 'error', 'message': 'Error occured in adding faculty .Try again.' });
                }
                return res.json({ 'status': true, 'type': 'success', 'message': 'Faculty added successfully.' });
            });
        }
        else
            return res.json({ 'status': true, 'type': 'existed', 'message': 'Already faculty existed with that email.' });
    })
}

exports.getFaculty = (req,res) => {
    Faculty.find({company_id:req.params.company_id}).then((data)=>{
        return res.json(data);
    }).catch((err)=>{
        return res.json(err);
    })
}


exports.facultyLogin = (req,res) =>{
    const { email, password } = req.body;

  if (!password || !email) {
    return res.status(422).send({ errors: [{ title: 'Data missing!', detail: 'Provide email and password!' }] });
  }

  Faculty.findOne({ email }, function (err, faculty) {
    if (err) {
      return res.status(422).send({ errors: normalizeErrors(err.errors) });
    }
    if (!faculty) {
      return res.status(422).send({ errors: [{ title: 'Invalid Faculty!', detail: 'Faculty does not exist' }] });
    }

    if (faculty.hasSamePassword(password)) {
        const token = jwt.sign({
        userId: faculty.id,
        name: faculty.name,
        email: faculty.email,
        role: 'teacher'
      }, config.SECRET, { expiresIn: '1h' });

      return res.json(token);
    } else {
      return res.status(422).send({ errors: [{ title: 'Wrong Data!', detail: 'Wrong email or password' }] });
    }
  });
}