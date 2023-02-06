const request = require("supertest")
const mongoose = require('mongoose')
const User = require('../../../models/User');
const app = require("../../../app")

test('return 200 on following user', async() =>{
    // GENERATE FRONT DATA
    const user1 = global.generateUser()
    const user2 = global.generateUser()

    // REGISTER USER
    const { body: cookie } = await request(app).post("/api/register").send(user1).expect(201)
    const { body: profile } = await request(app).post("/api/register").send(user2).expect(201)

    // FOLLOW
    const { body } = await request(app).put(`/api/user/follow/${profile.data.name.toLowerCase()}`).set("Cookie", [`${cookie.token[0]}=${cookie.token[1]}`]).expect(200)
    expect(body.success).toEqual(true)

    //const users = await User.findOne()
    // TODO CONTINU TEST

    // UNFOLLOW
    await request(app).put(`/api/user/follow/${profile.data.name.toLowerCase()}`).set("Cookie", [`${cookie.token[0]}=${cookie.token[1]}`]).expect(200)

    //const users2 = await User.find()
    // TODO CONTINU TEST
})

test.todo('return 400 on following user that doesnt exist')
test.todo('return 403 on try follow user and not authentified')

// test('return 200 on visiting a user profile while on private zone', async() =>{
//     // GENERATE FRONT DATA
//     const user1 = global.generateUser()
//     const user2 = global.generateUser()

//     // REGISTER USER
//     const { body: cookie } = await request(app).post("/api/register").send(user1).expect(201)
//     const { body: profile } = await request(app).post("/api/register").send(user2).expect(201)

//     // FOLLOW
//     const { body } = await request(app).get(`/api/user/${profile.data.name.toLowerCase()}`).set("Cookie", [`${cookie.token[0]}=${cookie.token[1]}`]).expect(200)
//     console.log(body)
// })
