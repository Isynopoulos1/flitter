const request = require("supertest")
const app = require("../../../app")

it("return 201 when new user register", async () => {
  const user = global.generateUser()
  const { body } = await request(app).post("/api/register").send(user).expect(201)

  console.log(body)
})
