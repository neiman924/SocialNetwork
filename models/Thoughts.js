//const mongoose = require ('mongoose');
// const Schema = mongoose.Schema;
const usersSchema = require('./Users');

const { Schema, model } = require('mongoose');

const thoughtSchema = new Schema(
  {
    thoughtName: {
      type: String,
      required: true,
      max_length: 50,
    },
    createDate: {
      type: Date,
      default: Date.now(),
    },
    username: {
      type: String,
      required: false,
      max_length: 50,
    },
    user: [
      {
        type: Schema.Types.ObjectId,
        ref: 'users',
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    // id: false,
  }
);

const Thoughts = model('thoughts', thoughtSchema);

module.exports = Thoughts;
