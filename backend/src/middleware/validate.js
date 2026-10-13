const { validationResult } = require("express-validator");
const ApiError = require("../utils/ApiError");

// Place after an array of express-validator checks: `[check(...), ..., validate]`
function validate(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const details = errors.array().map((e) => ({ field: e.path, message: e.msg }));
  next(new ApiError(422, "Validation failed.", details));
}

module.exports = validate;
