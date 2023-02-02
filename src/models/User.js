const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const { Schema } = mongoose
const number = Math.random().toString()

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: "https://i.pravatar.cc/300"
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
  following: [
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

UserSchema.methods.follow = function (userId) {
  if (!this.following.some((id) => id.equals(userId))) {
    this.following.push(userId);
    return this.save();
  }
  return Promise.resolve(this);
}
  
UserSchema.methods.unfollow = function (userId) {
  if (this.following.some((id) => id.equals(userId))) {
    this.following.remove(userId);
    return this.save();
  }
  return Promise.resolve(this);
}

UserSchema.methods.isFollowing = function (userId) {
  return this.following.some((id) => id.equals(userId));
};

UserSchema.virtual("password").set(function (value) {
  this.passwordHash = bcrypt.hashSync(value, 12)
})

UserSchema.options.toJSON = {
  transform(doc, ret) {
    delete ret.passwordHash
  }
}

module.exports = User = mongoose.model("users", UserSchema)
