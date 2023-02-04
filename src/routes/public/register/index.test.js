const request = require("supertest")
const app = require("../../../app")

it("return 201 when new user register", async () => {
  const user = global.generateUser()
  const { body } = await request(app).post("/api/register").send(user).expect(201)

  expect(body.success).toEqual(true)
  expect(body.token[0]).toEqual("express:sess")
})

it("return 400 when try register a user with an email that already exist", async () => {
  const user = global.generateUser()
  await request(app).post("/api/register").send(user).expect(201)
  const { body } = await request(app).post("/api/register").send(user).expect(400)

  expect(body.error).toEqual("Email already exist")
})

it("return 400 when try register a user and missing or incorrect required fields", async () => {
  const user1 = { ...global.generateUser(), email: "" }
  const user2 = { ...global.generateUser(), email: "asdasdas" }
  const user3 = { ...global.generateUser(), password2: "asdaasdasdsdas" }

  const { body: error1 } = await request(app).post("/api/register").send(user1).expect(400)
  const { body: error2 } = await request(app).post("/api/register").send(user2).expect(400)
  const { body: error3 } = await request(app).post("/api/register").send(user3).expect(400)

  expect(error1.email).toEqual("Email field is required")
  expect(error2.email).toEqual("Email is invalid")
  expect(error3.password2).toEqual("Passwords must match")
})
