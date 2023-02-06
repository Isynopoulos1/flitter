const request = require("supertest")
const mongoose = require("mongoose")
const User = require("../../../models/User")
const app = require("../../../app")

test("return 200 on visiting a user profile while on public zone", async () => {
  // GENERATE FRONT DATA
  const user1 = global.generateUser()

  // REGISTER USER
  const { body: profile } = await request(app).post("/api/register").send(user1).expect(201)

  // FOLLOW
  const { body } = await request(app).get(`/api/user/${profile.data.name.toLowerCase()}`).expect(200)
  expect(Object.keys(body?.user)).toEqual(["_id", "name", "email", "avatar", "followers", "following", "date", "__v"])
})
