const mongoose = require("mongoose"); 

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
    minLength: [3, "Blog title must contain atleast 3 characters"],
  },
  mainImage: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  intro: {
    type: String,
    required: true,
    minLength: [100, "Blog intro must contain at least 100 characters!"],
  },
  paraOneImage: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  paraOneDescription: {
    type: String,
  },
  paraOneTitle: {
    type: String,
  },
  paraTwoImage: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  paraTwoDescription: {
    type: String,
  },
  paraTwoTitle: {
    type: String,
  },

  category: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  authorName: {
    type: String,
    required: true,
  },
  authorAvatar: {
    type: String,
    required: true,
  },
  published: {
    type: Boolean,
    default: false,
  },
});

const blogModel = mongoose.model("Blog", blogSchema);
module.exports = blogModel;
