const express = require("express")
const router = express.Router({ mergeParams: true })
const petController = require("../controllers/petController")
const authController = require("./../controllers/authController")
const multer = require("multer")

const { storage } = require("./../utils/cloudinary")

const upload = multer({ storage: storage("photos/pets") })

router.route("/like").post(authController.protect, petController.addLike)

router
  .route("/mine")
  .all(authController.protect)
  .get(petController.getUserPets)
  .post(upload.single("image"), petController.addPet)

router
  .route("/all")
  .get(petController.getPetList)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    upload.single("image"),
    petController.addPet
  )
router.get("/", (req, res) => {
  res.redirect("/pet/all")
})
router
  .route("/:petId")
  .get(petController.getPet)
  .patch(
    authController.protect,
    upload.single("image"),
    petController.updatePet
  )
  .delete(authController.protect, petController.deletePet)

module.exports = router
