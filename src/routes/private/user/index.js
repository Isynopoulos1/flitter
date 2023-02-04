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
    throw new ErrorHandler(400, 'No puedes seguir tu propio perfil');
  }

  const [authUserProfile, profileToFollow] = await Promise.all([
    User.findOne({ user: authUserId }),
    User.findOne({ user: userId }),
  ]);

  if (!profileToFollow) {
    throw new ErrorHandler(404, 'No existe este usuario');
  }

  if (authUserProfile.isFollowing(userId)) {
    throw new ErrorHandler(400, 'Ya sigues a este usuario');
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
    throw new ErrorHandler(400, 'No puedes dejar de seguir tu propio perfil');
  }

  const [authUserProfile, profileToFollow] = await Promise.all([
    User.findOne({ user: authUserId }),
    User.findOne({ user: userId }),
  ]);

  if (!profileToFollow) {
    throw new ErrorHandler(404, 'No existe este usuario');
  }

  if (!authUserProfile.isFollowing(userId)) {
    throw new ErrorHandler(400, 'No puedes dejar de seguir a un usuario al que no sigues');
  }

  profileToFollow.followers.remove(authUserId);

  await Promise.all([authUserProfile.unfollow(userId), profileToFollow.save()]);

  return res.json({ profile: authUserProfile });
})

module.exports = router
