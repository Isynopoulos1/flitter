const Validator = require("validator")
const isEmpty = require("./isEmpty")

module.exports = inputValidator = (data) => {
  let errors = {}

  data.text = !isEmpty(data.text) ? data.text : ""

  if (!Validator.isLength(data.text, { min: 2, max: 256 })) {
    errors.text = "Text must be between 2 and 256 characters"
  }
  if (Validator.isEmpty(data.text)) {
    errors.text = "Text field is required"
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
