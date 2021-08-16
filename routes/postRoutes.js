const express = require("express");
const {
  getAllPosts,
  createPost,
  getOnePost,
  updatePost,
  deletePost,
} = require("../controllers/postController");
const protect = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/").get(getAllPosts).post(protect, createPost);

router
  .route("/:id")
  .get(getOnePost)
  .patch(protect, updatePost)
  .delete(protect, deletePost);

module.exports = router;
