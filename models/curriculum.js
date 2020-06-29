const mongoose = require('mongoose');
const Schema = mongoose.Schema;

'use strict';
const curriculumSchema = new Schema({
    comapany_id: { type: Schema.Types.ObjectId, ref: 'User' },
    title: { type: String },
    curriculum_status: { type: Number, default: 1 },
    is_assigned: { type: Number, default: 0 },
    curriculum_data: [{
        unit_number: { type: Number },
        title: { type: String },
        description: { type: String },
        url: { type: String },
        duration: { type: String }
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Curriculum', curriculumSchema);