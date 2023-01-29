const mongoose = require("mongoose")
const { Schema } = mongoose

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  passwordHash: {
    type: String,
    default: bcrypt.hashSync(number, 12)
  },
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "users"
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
})

// MANAGE PASSWORD ENCRYPTION
UserSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.passwordHash)
}

UserSchema.virtual("password").set(function (value) {
  this.passwordHash = bcrypt.hashSync(value, 12)
})

UserSchema.options.toJSON = {
  transform(doc, ret) {
    delete ret.passwordHash
  }
}

module.exports = User = mongoose.model("users", UserSchema)
