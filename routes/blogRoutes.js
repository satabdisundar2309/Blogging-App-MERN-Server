const express = require("express");
const blogRouter = express.Router();

const { blogPost, deleteBlog, getAllBlogs, getSingleBlog, getMyBlogs, updateBlog } = require("../controllers/blogsController");
const { authenticate } = require("../middlewares/auth");
const { authorize } = require("../middlewares/auth");

blogRouter.post("/post", authenticate, authorize("Author"), blogPost);
blogRouter.delete(
  "/delete/:id",
  authenticate,
  authorize("Author"),
  deleteBlog
);
blogRouter.get("/all", getAllBlogs);
blogRouter.get("/singleblog/:id", authenticate, getSingleBlog);
blogRouter.get("/myblogs", authenticate, authorize("Author"), getMyBlogs);
blogRouter.put("/update/:id", authenticate, authorize("Author"), updateBlog);

module.exports = blogRouter;
