const { Schema, model } = require('mongoose');
const thoughtsSchema = require('./Thoughts');

// Schema to create user model
const userSchema = new Schema(
  {
    first: {
      type: String,
      required: true,
      max_length: 50,
    },
    last: {
      type: String,
      required: true,
      max_length: 50,
    },
    email: {
      type: String,
      required: false,
      max_length: 50,
    },
    //comments: [thoughtsSchema],
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

const User = model('users', userSchema);

module.exports = User;
