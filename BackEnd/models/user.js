const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { createTokenForUser } = require('../services/authentication');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  emailOTP: String,
  emailOTPExpiry: Date,
}, { timestamps: true });


userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
});


userSchema.statics.matchPasswordAndGenerateToken = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = createTokenForUser(user);
  return token;
};



const User = mongoose.model('User', userSchema);
module.exports = User;