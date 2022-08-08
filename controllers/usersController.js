// ObjectId() method for converting userID string into an ObjectId for querying database
const { ObjectId } = require('mongoose').Types;
const { Users, Thoughts } = require('../models');

const headCount = async () =>
  Users.aggregate()
    .count('userCount')
    .then((numberOfUsers) => numberOfUsers);

// Execute the aggregate method on the user model and calculate the overall grade by using the $avg operator
const grade = async (userId) =>
  Users.aggregate([
    // only include the given user by using $match
    { $match: { _id: ObjectId(userId) } },
    {
      $unwind: '$thoughts',
    },
    {
      $group: {
        _id: ObjectId(userId),
        overallGrade: { $avg: '$thoughts.score' },
      },
    },
  ]);

module.exports = {
  // Get all users
  getUsers(req, res) {
    Users.find()
      .then(async (users) => {
        const userObj = {
          users,
          headCount: await headCount(),
        };
        return res.json(userObj);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Get a single user
  getSingleUser(req, res) {
    Users.findOne({ _id: req.params.userId })
      .select('-__v')
      .lean()
      .then(async (user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json({
              user,
              grade: await grade(req.params.userId),
            })
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // create a new user
  createUser(req, res) {
    Users.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },
  // Delete a user and remove them from the Thoughts
  deleteUser(req, res) {
    Users.findOneAndRemove({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No such user exists' })
          : Thoughts.findOneAndUpdate(
              { users: req.params.userId },
              { $pull: { users: req.params.userId } },
              { new: true }
            )
      )
      .then((thought) =>
        !thought
          ? res.status(404).json({
              message: 'User deleted, but no thought found',
            })
          : res.json({ message: 'User successfully deleted' })
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // Add an thoughts to a user
  addThought(req, res) {
    console.log('You are adding a thought');
    console.log(req.body);
    Users.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { thoughts: req.body } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res
              .status(404)
              .json({ message: 'No user found with that ID :(' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Remove thoughts from a user
  removeThought(req, res) {
    Users.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { thoughts: { thoughtId: req.params.thoughtId } } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res
              .status(404)
              .json({ message: 'No user found with that ID :(' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
};
