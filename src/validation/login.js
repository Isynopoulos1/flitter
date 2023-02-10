const Validator = require("validator")
const isEmpty = require("./isEmpty")

module.exports = inputValidator = (data) => {
  let errors = {}

  data.name = !isEmpty(data.name) ? data.name : ""
  data.password = !isEmpty(data.password) ? data.password : ""

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name must be between 2 and 30 characters"
  }
  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required"
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required"
  }
  return {
    errors,
    isValid: isEmpty(errors)
  }
}
