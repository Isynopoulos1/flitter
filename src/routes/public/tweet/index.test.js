const request = require("supertest")
const mongoose = require("mongoose")
const User = require("../../../models/User")
const app = require("../../../app")

test("return 200 on listing tweets with pagination", async () => {
  // GENERATE AND REGISTER USER
  const userData = global.generateUser()
  const { body: cookie } = await request(app).post("/api/register").send(userData).expect(201)

  // GENERATE 30 TWEETS
  for (var i = 0; i < 30; i++) {
    const tweetData = global.generateTweet()
    await request(app)
      .post("/api/create-tweet")
      .set("Cookie", [`${cookie.token[0]}=${cookie.token[1]}`])
      .send(tweetData)
      .expect(201)
  }

  // TEST LIST ENDPOINT
  const params = { page: 0, limit: 20 }
  const { body } = await request(app).get(`/api/tweet?page=${params.page}&limit=${params.limit}`).expect(200)

  expect(body[0].tweets.length).toEqual(20)
  expect(body[0].total[0].count).toEqual(30)
})

test("return 200 on searching tweets", async () => {
  // GENERATE AND REGISTER USER
  const userData = global.generateUser()
  const { body: cookie } = await request(app).post("/api/register").send(userData).expect(201)

  // GENERATE 30 TWEETS
  let texts = []
  for (var i = 0; i < 30; i++) {
    const tweetData = global.generateTweet()
    await request(app)
      .post("/api/create-tweet")
      .set("Cookie", [`${cookie.token[0]}=${cookie.token[1]}`])
      .send(tweetData)
      .expect(201)
    texts.push(tweetData.text)
  }

  // TEST LIST ENDPOINT
  const searchableWord = texts[0].split(" ")[0]
  const params = { page: 0, limit: 20 }
  const { body } = await request(app).get(`/api/tweet?page=${params.page}&limit=${params.limit}&search=${searchableWord}`).expect(200)

  const isMatch = body[0].tweets.map((tweet) => tweet.text.includes(searchableWord))
  expect(isMatch).toBeTruthy()

  console.log(body[0].tweets)
})
