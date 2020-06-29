const mongoose = require('mongoose');
const Schema = mongoose.Schema;

'use strict';
const studentcoursestatusSchema = new Schema({
  student_id: { type: Schema.Types.ObjectId, ref: 'Subscriber' },
  course_id: { type: Schema.Types.ObjectId, ref: 'Course' },
  curriculum_id:{type:String},
  createdAt: { type: Date, default: Date.now },
  updatedAt:{type: Date, default: Date.now}
});

module.exports = mongoose.model('Student_course_status', studentcoursestatusSchema);