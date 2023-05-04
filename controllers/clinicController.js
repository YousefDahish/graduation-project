var query = require("../db/query")
var Connection = require("../db/connection")

exports.getClinicList = async (req, res) => {
  try {
    var clinicListQuery = query.queryList.GET_CLINIC_LIST_QUERY
    var result = await Connection.dbQuery(clinicListQuery)
    return res.status(200).send(JSON.stringify(result.rows))
  } catch (err) {
    return res.status(500).send({ error: "Failed to list Clinic" })
  }
}

exports.addClinic = async (req, res) => {
  try {
    var clinic_id = req.body.clinic_id
    var phone = req.body.phone
    var e_mail = req.body.e_mail
    var rating = req.body.rating
    var clinic_imge = req.body.clinic_imge
    var info = req.body.info
    var country = req.body.country
    var city = req.body.city
    var name = req.body.name

    let values = [
      clinic_id,
      phone,
      e_mail,
      rating,
      clinic_imge,
      info,
      country,
      city,
      name,
    ]
    var saveClinicQuery = query.queryList.SAVE_CLINIC_QUERY
    await Connection.dbQuery(saveClinicQuery, values)
    return res.status(201).send("Successfully Clinic created ")
  } catch (err) {
    console.log("Error : " + err)
    return res.status(500).send({ error: "Failed to add Clinic" })
  }
}

exports.updateClinic = async (req, res) => {
  try {
    var clinic_id = req.body.clinic_id
    var phone = req.body.phone
    var e_mail = req.body.e_mail
    var rating = req.body.rating
    var clinic_imge = req.body.clinic_imge
    var info = req.body.info
    var country = req.body.country
    var city = req.body.city
    var name = req.body.name

    let values = [
      phone,
      e_mail,
      rating,
      clinic_imge,
      info,
      country,
      city,
      name,
      clinic_id,
    ]
    var updateClinicQuery = query.queryList.UPDATE_CLINIC_QUERY
    await Connection.dbQuery(updateClinicQuery, values)
    return res.status(201).send("Successfully Clinic updated ")
  } catch (err) {
    console.log("Error : " + err)
    return res.status(500).send({ error: "Failed to update Clinic" })
  }
}
exports.deleteClinic = async (req, res) => {
  try {
    var clinic_id = req.body.clinic_id
    if (!clinic_id) {
      return res.status(500).send({ error: "can not delete empty solid" })
    }
    var deleteClinicQuery = query.queryList.DELETE_CLINIC_QUERY
    await Connection.dbQuery(deleteClinicQuery, [clinic_id])
    return res.status(201).send("Successfully Clinic deleted ")
  } catch (err) {
    console.log("Error : " + err)
    return res.status(500).send({ error: "Failed to delete Clinic" })
  }
}