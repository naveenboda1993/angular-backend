const mongoose = require('mongoose');
const Schema = mongoose.Schema;

'use strict';
const courseSchema = new Schema({
  company_id: { type: Schema.Types.ObjectId, ref: 'User' },
  title: { type: String },
  description: { type: String },
  faculty_assigned: { type: Schema.Types.ObjectId, ref: 'Faculty' },
  curriculum_data: [{
    unit_number: { type: Number },
    title: { type: String },
    description: { type: String },
    url: { type: String },
    duration: { type: String }
  }],
  image_url: { type: String },
  course_status: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', courseSchema);