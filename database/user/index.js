import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String },
  address: [
    {
      detail: { type: String },
      for: { type: String },
    }
  ],
  phoneNumber: [
    {
      type: Number,
    }
  ],
}, {
  timestamps: true
});

// Method to generate JWT token
userSchema.methods.generateJwtToken = function () {
  return jwt.sign({ user: this._id.toString() }, "ZomatoApp");
};

// Static method to find user by email or phone number
userSchema.statics.findEmailAndPhone = async function ({ email, phoneNumber }) {
  const checkUserByEmail = await this.findOne({ email });
  const checkUserByPhoneNumber = await this.findOne({ phoneNumber });
  if (checkUserByEmail || checkUserByPhoneNumber) {
    throw new Error("User already exists");
  }
  return false;
};
//password checks
userSchema.statics.findByEmailAndPassword = async function ({ email, password }) {
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error("email does't exist");
  }
  const doesPasswordMatch = await bcrypt.compare(password,user.password);
  if (!doesPasswordMatch) {
    throw new Error("Invalid Password");
  }
  return user;
};

// Pre-save hook to hash password
userSchema.pre("save", function (next) {
  const user = this;
  // Password is not modified
  if (!user.isModified("password")) return next();
  // Generating bcrypt salt
  bcrypt.genSalt(8, (error, salt) => {
    if (error) return next(error);
    bcrypt.hash(user.password, salt, (error, hash) => {
      if (error) return next(error);
      // Assigning hashed password
      user.password = hash;
      next();
    });
  });
});

export const UserModel = mongoose.model("User", userSchema);

