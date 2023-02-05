const { faker } = require("@faker-js/faker")
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
