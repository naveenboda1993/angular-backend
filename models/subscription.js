const mongoose = require('mongoose');
const Schema = mongoose.Schema;

'use strict';
const subscriptionSchema = new Schema({
  subscriber_id: { type: Schema.Types.ObjectId, ref: 'Subscriber' },
  course_id: { type: Schema.Types.ObjectId, ref: 'Course' },
  subscription_status: { type: Number, default:0 },
  subscription_viewed_at: { type: Date ,default:null},
  subscription_approved_role: { type: Number,default:null },
  subscription_approved_by: { type: String, default:null },
  subscriber_created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Subscription', subscriptionSchema);