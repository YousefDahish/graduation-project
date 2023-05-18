var query = require("../db/query")
var connection = require("../db/connection")

exports.getClinicList = async (req, res) => {
  try {
    const result = await connection.dbQuery(query.selectAllQuery(`clinic`))
    res.status(200).json({ status: "successful", data: result.rows })
  } catch (err) {
    res.status(500).json({ error: "Failed to list Clinic" })
  }
}
exports.getClinic = async (req, res) => {
  try {
    if (!(await connection.isExist("clinic", req.params.clinicId))) {
      return res
        .status(404)
        .json({ status: "fail", message: "please provide valid id" })
    }
    const result = await connection.dbQuery(
      query.selectOneQuery(`clinic`, req.params.clinicId)
    )
    res.status(200).json({ status: "successful", data: result.rows })
  } catch (err) {
    res.status(500).json({ error: "Failed to list Clinic" })
  }
}

exports.addClinic = async (req, res) => {
  try {
    if (req.file) {
      req.body.image_url = req.file.path
    }
    console.log(req.body)
    const columns = Object.keys(req.body).join(", ")
    const values = Object.values(req.body)
      .map((value) => `'${value}'`)
      .join(", ")
    const result = await connection.dbQuery(
      query.insertQuery("clinic", columns, values)
    )
    res.status(201).json({ status: "successful", data: result.rows })
  } catch (err) {
    res.status(500).json({ error: `Failed to add Clinic ${err.message}` })
  }
}

exports.updateClinic = async (req, res) => {
  try {
    if (req.file) {
      req.body.image_url = req.file.path
    }
    const id = req.params.clinicId
    if (!(await connection.isExist("clinic", req.params.clinicId))) {
      return res
        .status(404)
        .json({ status: "fail", message: "please provide valid id" })
    }
    const result = await connection.dbQuery(
      query.updateOneWhereId("clinic", req.body, id)
    )
    res.status(200).json({ status: "successful", data: result.rows })
  } catch (err) {
    res.status(500).json({ error: `Failed to update Clinic ${err.message}` })
  }
}
exports.deleteClinic = async (req, res) => {
  try {
    if (!(await connection.isExist("clinic", req.params.clinicId))) {
      return res
        .status(404)
        .json({ status: "fail", message: "please provide valid id" })
    }
    const result = await connection.dbQuery(
      query.deleteOneQuery("clinic", req.params.clinicId)
    )
    res
      .status(200)
      .json({ status: "successful", message: "clinic deleted successfully" })
  } catch (err) {
    res.status(500).json({ error: `Failed to delete Clinic ${err.message}` })
  }
}
