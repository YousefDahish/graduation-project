const express = require("express")
const router = express.Router()
const commentsController = require("../controllers/commentController")
const authController = require("../controllers/authController")

router
  .route("/")
  .get(commentsController.getPetComments)
  .post(authController.protect, commentsController.addComment)
router.get(
  "/all",
  authController.protect,
  authController.restrictTo(["admin"]),
  commentsController.getAllComments
)
router
  .route("/:commentId")
  .patch(authController.protect, commentsController.updateComment)
  .delete(authController.protect, commentsController.deleteComment)

module.exports = router
