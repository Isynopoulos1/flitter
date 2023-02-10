const express = require("express")
const User = require("../../../models/User")
const isAuth = require("../../../middlewares/isAuth")

// DECLARE ROUTER
const router = express.Router()

// @route  GET api/user
// @desc   get own account data
// @access Private
router.get("/api/user", isAuth, async (req, res) => {
  // VARIABLES
  const { _id: userId } = req.user

  // TRANSACTION
  try {
    const user = await User.findOne({ _id: userId }).select("-passwordHash")
    return res.status(200).json({ user })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: `something unexpected happen, ${e}` })
  }
})

// @route  DELETE api/user
// @desc   delete own account
// @access Private
router.delete("/api/user", isAuth, async (req, res) => {
  // VARIABLES
  const { _id: userId } = req.user

  // TRANSACTION
  try {
    await User.findOneAndDelete({ _id: userId })
    res.status(202).json({ success: true })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: `something unexpected happen, ${e}` })
  }
})

// @route  PUT api/user/follow/:userId
// @desc   unfollow a user
// @access Private
router.put("/api/user/follow/:name", isAuth, async (req, res) => {
  // DEFINE VARIABLES
  //const { userId } = req.params; //no sería userId sino nickname
  const { name } = req.params //no sería userId sino nickname
  const { _id: userId } = await User.findOne({ name: name.toLowerCase() })

  //buscar id del nickname del parámetro
  const { _id: authUserId } = req.user
  let authUserProfile, profileToFollow

  // CHECK IF USERS EXIST
  if (userId === authUserId.toString()) {
    return res.status(400).json({ error: "No puedes seguir tu propio perfil" })
  }

  try {
    authUserProfile = await User.findOne({ _id: authUserId })
    profileToFollow = await User.findOne({ _id: userId })
  } catch (error) {
    return res.status(500).json({ error: "something wrong happen" })
  }

  if (!authUserProfile || !profileToFollow) {
    return res.status(500).json({ error: "user doesnt exist" })
  }

  // FOLLOW OR UNFOLLOW
  const indexOfUser = profileToFollow.followers.findIndex((f) => f.toString() === authUserId)
  indexOfUser === -1 ? profileToFollow.followers.unshift(authUserId) : profileToFollow.followers.splice(indexOfUser, 1)

  const indexOfUser2 = authUserProfile.following.findIndex((f) => f.toString() === userId)
  indexOfUser2 === -1 ? authUserProfile.following.unshift(userId) : authUserProfile.following.splice(indexOfUser2, 1)

  await profileToFollow.save()
  await authUserProfile.save()

  return res.status(200).json({ success: true })
})

module.exports = router
