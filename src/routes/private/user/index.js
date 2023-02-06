const express = require("express")
const User = require('../../../models/User');
const isAuth = require("../../../middlewares/isAuth")

// DECLARE ROUTER
const router = express.Router()

// // @route  GET api/user/:name
// // @desc   Get user profile info
// // @access Private
// router.get("/api/user/:name", isAuth, async (req, res) => {
//   const { name } = req.params;
//   const user =  await User.findOne({ name: name });
//   return res.status(200).json({ user })
// })

// @route  PUT api/user/follow/:userId
// @desc   unfollow a user
// @access Private
//router.put("/api/user/follow/:userId", isAuth, async (req, res)=> {
router.put("/api/user/follow/:name", isAuth, async (req, res)=> {
  // DEFINE VARIABLES
  //const { userId } = req.params; //no sería userId sino nickname
  const { name } = req.params; //no sería userId sino nickname
  const {_id: userId } =  await User.findOne({ name: name.toLowerCase() });

  //buscar id del nickname del parámetro
  const { _id: authUserId } = req.user;
  let authUserProfile, profileToFollow

  // CHECK IF USERS EXIST
  if (userId === authUserId.toString()) {
    return res.status(400).json({ error:'No puedes seguir tu propio perfil' })
  }

  try {
    authUserProfile =  await User.findOne({ _id: authUserId });
    profileToFollow =  await User.findOne({ _id: userId });
  } catch (error) {
    return res.status(500).json({ error: 'something wrong happen' })
  }

  if (!authUserProfile ||  !profileToFollow) {
    return res.status(500).json({ error: 'user doesnt exist' })
  }

  // FOLLOW OR UNFOLLOW
  const indexOfUser = profileToFollow.followers.findIndex(f => f.toString() === authUserId);
  indexOfUser === -1
    ? profileToFollow.followers.unshift(authUserId)
    : profileToFollow.followers.splice(indexOfUser, 1);

  const indexOfUser2 = authUserProfile.following.findIndex(f => f.toString() === userId);
  indexOfUser2 === -1
    ? authUserProfile.following.unshift(userId)
    : authUserProfile.following.splice(indexOfUser2, 1);

  await profileToFollow.save()
  await authUserProfile.save()

  return res.status(200).json({ success: true})
})

module.exports = router
