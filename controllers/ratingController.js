const connection = require("../db/connection")
const query = require("../db/query")
const validator = require("../utils/validator")

exports.getAllRating = async (req, res) => {
  try {
    const result = await connection.dbQuery(query.selectAllQuery("rating"))
    res.status(200).json({ status: "successful", data: result.rows })
  } catch (err) {
    console.log(err.message)
    res.status(400).send({ error: "Failed to list Rating" })
  }
}

exports.addRating = async (req, res) => {
  try {
    const { score, clinic_id, user_id } = req.body
    let values = [score, clinic_id, user_id]
    const result = await connection.dbQuery(
      query.queryList.SAVE_RATING_QUERY,
      values
    )
    res.status(200).json({ status: "successful", data: result.rows })
  } catch (err) {
    res.status(500).send({ error: `Failed to add rating ${err.message}` })
  }
}

exports.updateRating = async (req, res) => {
  try {
    const { score, id } = req.body
    let values = [score, id]
    if (!(await connection.isExist("rating", req.params.id))) {
      return res
        .status(404)
        .json({ status: "fail", message: "please provide valid id" })
    }
    if (!(await validator.isOwner("solid", req))) {
      return res.status(403).json({
        status: "fail",
        message: "you don't own permissions to do this!",
      })
    }
    const result = await connection.dbQuery(
      query.queryList.UPDATE_RATING_QUERY,
      values
    )
    res.status(200).json({ status: "successful", data: result.rows })
  } catch (err) {
    res.status(400).send({ error: `Failed to update rating ${err.message}` })
  }
}

exports.deleteRating = async (req, res) => {
  try {
    if (!(await connection.isExist("rating", req.params.ratingId))) {
      return res
        .status(404)
        .json({ status: "fail", message: "please provide valid id" })
    }
    await connection.dbQuery(
      query.deleteOneQuery("rating", req.params.clinicId)
    )
    res
      .status(200)
      .json({ status: "successful", message: "rating deleted successfully" })
  } catch (err) {
    res.status(500).json({ error: `Failed to delete Clinic ${err.message}` })
  }
}
