const express = require("express")
const router = express.Router()
const clinicController = require("../controllers/clinicController")
const authController = require("./../controllers/authController")

router
  .route("/")
  .get(clinicController.getClinicList)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    clinicController.addClinic
  )
router
  .route("/:clinicId")
  .get(clinicController.getClinic)
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    clinicController.updateClinic
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    clinicController.deleteClinic
  )

module.exports = router
