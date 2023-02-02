const express = require("express")
const User = require('../../../models/User');
const isAuth = require("../../../middlewares/isAuth")

// DECLARE ROUTER
const router = express.Router()

// @route  GET api/user
// @desc   Get user info
// @access Private
router.get("/api/user", isAuth, async (req, res) => {
  // FINALIZE ENDPOINT
  res.json({ success: true, user: req.user })
})

// @route  POST api/tweet
// @desc   Follow a user
// @access Private
router.post("/api/user/:userId", isAuth, async (req, res) => {
  const userId = req.params.userId;
  // req.user??? Comprobar contenido
  const { _id: authUserId } = req.user;

  if (userId === authUserId.toString()) {
    throw new ErrorHandler(400, 'You cannot follow your own profile');
  }

  const [authUserProfile, profileToFollow] = await Promise.all([
    User.findOne({ user: authUserId }),
    User.findOne({ user: userId }),
  ]);

  if (!profileToFollow) {
    throw new ErrorHandler(404, 'Profile does not exists');
  }

  if (authUserProfile.isFollowing(userId)) {
    throw new ErrorHandler(400, 'You already follow that profile');
  }

  profileToFollow.followers.push(authUserId);

  await Promise.all([authUserProfile.follow(userId), profileToFollow.save()]);

  return res.json({ profile: authUserProfile });
})

// @route  DELETE api/tweet
// @desc   unfollow a user
// @access Private
router.delete("/api/user/:userId", isAuth, async (req, res) => {
  const userId = req.params.userId;
  const { _id: authUserId } = req.user;

  if (userId === authUserId.toString()) {
    throw new ErrorHandler(400, 'You cannot unfollow your own profile');
  }

  const [authUserProfile, profileToFollow] = await Promise.all([
    User.findOne({ user: authUserId }),
    User.findOne({ user: userId }),
  ]);

  if (!profileToFollow) {
    throw new ErrorHandler(404, 'Profile does not exists');
  }

  if (!authUserProfile.isFollowing(userId)) {
    throw new ErrorHandler(400, 'You do not follow that profile');
  }

  profileToFollow.followers.remove(authUserId);

  await Promise.all([authUserProfile.unfollow(userId), profileToFollow.save()]);

  return res.json({ profile: authUserProfile });
})

module.exports = router
