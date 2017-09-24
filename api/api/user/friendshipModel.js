var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var bcrypt = require('bcrypt');
var FriendshipSchema = new Schema({
  user1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  }, 

  user2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },

  relation: {
    type: String,
    required: true
  }
});

FriendshipSchema.index({ user1: 1, user2: 1}, { unique: true });

module.exports = mongoose.model('friendship', FriendshipSchema);