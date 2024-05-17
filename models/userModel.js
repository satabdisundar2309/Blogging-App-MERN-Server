const mongoose = require("mongoose");
const validator = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [3, "Name must be atleast 3 characters"],
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "Please enter a valid email"]
  },
  phone: {
    type: Number,
    required: true,
  },
  avatar: {
    public_id: {
        type: String,
        required: true
    },
    url : {
        type: String,
        required: true
    }
  },
  education: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["Reader", "Author"]
  },
  createdOn: {
    type: Date,
    default: Date.now()
  },
  password: {
    type: String,
    required: true,
    minLength: [6, "Password must be atleast 6 characters"],
    select: false
  }
});

userSchema.pre('save', async function(){
  if(!this.isModified("password")){
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods.comparePassword = async function (password){
  return await bcrypt.compare(password, this.password);
}

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
