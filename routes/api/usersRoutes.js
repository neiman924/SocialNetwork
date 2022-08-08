const router = require('express').Router();
const {
  getUsers,
  getSingleUser,
  createUser,
  deleteUser,
  addThought,
  removeThought,
} = require('../../controllers/UsersController');

// /api/Users
router.route('/').get(getUsers).post(createUser);

// /api/Users/:UserId
router.route('/:UserId').get(getSingleUser).delete(deleteUser);

// /api/Users/:UserId/Thoughts
router.route('/:UserId/Thoughts').post(addThought);

// /api/Users/:UserId/Thoughts/:ThoughtId
router.route('/:UserId/Thoughts/:ThoughtId').delete(removeThought);

module.exports = router;
