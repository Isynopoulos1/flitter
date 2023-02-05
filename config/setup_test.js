const { faker } = require("@faker-js/faker")
const request = require("supertest")
const app = require("../src/app")
const dbhandler = require("./setup_database")

// CREATE TEST DATABASE
beforeAll(async () => await dbhandler.connect())

// DROP TEST DABASE
beforeEach(async () => await dbhandler.clearDatabase())

// CLOSE TEST DATABSE
afterAll(async () => await dbhandler.closeDatabase())

// GLOBAL MOCK FRONTEND DATA
global.generateUser = () => {
  const password = faker.internet.password()
  return {
    name: faker.internet.userName(),
    email: faker.internet.email()?.toLowerCase(),
    password,
    password2: password
  }
}


// GLOBAL SCOPE
global.register =async (user) => {
  const { body } = await request(app).post("/api/register").send(user).expect(201)

  // BUILD OBJECT AND BASE 6$ ENCRYPT
  return [`${body.token[0]}=${body.token[1]}`]
}

