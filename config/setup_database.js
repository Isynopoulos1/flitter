const mongoose = require("mongoose")
const { MongoMemoryServer } = require("mongodb-memory-server")

let mongo

module.exports.connect = async () => {
  mongo = await MongoMemoryServer.create()
  const mongoUri = await mongo.getUri()
  await mongoose.connect(mongoUri)
}

module.exports.clearDatabase = async () => {
  const collections = await mongoose.connection.db.collections()
  for (let collection of collections) {
    await collection.deleteMany({})
  }
}

module.exports.closeDatabase = async () => {
  await mongo.stop()
  await mongoose.connection.close()
}
