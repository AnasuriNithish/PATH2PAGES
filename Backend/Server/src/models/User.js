const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Utility for auto-creating usernames from name/email
function generateUsername(name, email) {
  const base = name ? name.replace(/\s+/g, "").toLowerCase() : "";
  const domain = email.split("@")[0].toLowerCase();
  return `${base || domain}_${Math.floor(Math.random() * 10000)}`;
}

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true }, // auto-set if not provided
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    mobile: { type: String, required: true }, // changed from phone for consistency
    fullAddress: { type: String, required: true }, // changed from address for consistency
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Auto-generate username before validation if not supplied from frontend
UserSchema.pre("validate", async function (next) {
  if (!this.username) {
    let proposed = generateUsername(this.name, this.email);
    // Ensure uniqueness in DB if needed
    let userExists = await mongoose.models.User.findOne({ username: proposed });
    while (userExists) {
      proposed = generateUsername(this.name, this.email);
      userExists = await mongoose.models.User.findOne({ username: proposed });
    }
    this.username = proposed;
  }
  next();
});

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

// Password comparison
UserSchema.methods.matchPassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Always use this export pattern to avoid OverwriteModelError (reuse model)
module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
