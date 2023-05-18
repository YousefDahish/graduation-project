const express = require("express")
const router = express.Router()
const ratingController = require("../controllers/ratingController")

router
  .route("/")
  .post(ratingController.addRating)
  .get(ratingController.getAllRating)
router
  .route("/:ratingId")
  .patch(ratingController.updateRating)
  .delete(ratingController.deleteRating)

module.exports = router
