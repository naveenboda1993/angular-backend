const mongoose = require('mongoose');
const Schema = mongoose.Schema;



'use strict';
const WebinarSchema = new Schema({
     id: { type: Number },
     title:  { type:String },
     description:  { type:String },
     link:  { type:String },
     imgurl:  { type:String },
     date:  {  type: Date },
     createdOn:  {  type: Date, default: Date.now },
     updatedOn:  {  type: Date, default: Date.now },
     createdBy:  { type: Schema.Types.ObjectId, ref: 'User' },
     faculty: {type: Schema.Types.ObjectId, ref: 'User' },
     subscriber: {type: String },
     company:  { type: Schema.Types.ObjectId, ref: 'Faculty' },
     users: [{
          user:{type: Schema.Types.ObjectId, ref: 'User' },
          createdOn:{  type: Date, default: Date.now }
        }],
});


module.exports = mongoose.model('Webinar', WebinarSchema );