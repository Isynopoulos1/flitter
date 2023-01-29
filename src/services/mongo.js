const mongoose = require("mongoose")
const { config } = require("../../config")

module.exports = async (client) => {
  // CONNECT TO MONGODB
  await mongoose.set("strictQuery", false)
  await mongoose.connect(config.mongo_uri)

  if (mongoose.connection.readyState === 1) {
    console.log(`${client} mongoDB connected`)
  }
}
