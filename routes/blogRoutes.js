const express = require("express");
const {
  handleCreateBlog,
  handleGetAllBlogs,
  handleEditBlog,
  handleDeleteBlog,
  handleGetBlogById,
  handleGetMyBlogs,
} = require("../controller/blog");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// Public route: Get all blogs with pagination
router.get("/", handleGetAllBlogs);

// Protected routes: Only accessible to logged-in users
router.post("/create-blog", auth, handleCreateBlog);
router.put("/edit-blog/:id", auth, handleEditBlog);
router.delete("/delete-blog/:id", auth, handleDeleteBlog);
router.get("/single-blog/:id", handleGetBlogById);
router.get("/my-blogs", auth, handleGetMyBlogs);

module.exports = router;
