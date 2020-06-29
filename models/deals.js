const mongoose = require('mongoose');
const Schema = mongoose.Schema;



'use strict';
const DealSchema = new Schema({
     dealId: { type: Number },
     dealTitle:  { type:String },
     badgeClass:  { type:String },
     dealMessage:  { type:String },
     messageType:  { type:String },
     messageCount:  { type:String },
     linkCount:  { type:String },
     imgurl:  { type:String },
     createdOn:  {  type: Date, default: Date.now },
     updatedOn:  {  type: Date, default: Date.now },
     createdBy:  { type: Schema.Types.ObjectId, ref: 'User' },
     assignedTo: {type: Schema.Types.ObjectId, ref: 'User' },
     isUserImg: { type: Boolean },
     status:  { type:String },
     company:  { type: Schema.Types.ObjectId, ref: 'Faculty' },
     comments: [{
          text:{type:String},
          createdOn:{  type: Date, default: Date.now }
        }],
});


module.exports = mongoose.model('Deals', DealSchema );