const express = require("express")
const router = express.Router()
const ratingController = require("../controllers/ratingController")

router
  .route("/")
  .post(ratingController.addRating)
  .get(ratingController.getRating)
router.route("/:id").put(ratingController.updateRating)

module.exports = router
