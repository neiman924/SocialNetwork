//const mongoose = require ('mongoose');
// const Schema = mongoose.Schema;

const { Schema, model } = require('mongoose');

const thoughtSchema = new Schema(
  {
    thoughtName: {
      type: String,
    },
    createDate: {
      type: Date,
      default: Date.now(),
    },
    users: [
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
    id: false,
  }
);

const Thoughts = model('thoughts', thoughtSchema);

module.exports = Thoughts;
