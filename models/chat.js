const mongoose = require('mongoose');
const Schema = mongoose.Schema;

'use strict';
const ChatSchema = new Schema({
  userid: { type: Schema.Types.ObjectId, ref: 'User'},
  message:  { type:String },
  fromUserId: { type: String },
  toUserId: { type: String},
  isRead: { type: Number },
  image: { type: String},
  createdAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model('Chat', ChatSchema );