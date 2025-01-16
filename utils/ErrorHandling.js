
const successResponse = (res, message, data, statusCode = 200) => {
  return res.json({
    statusCode,
    status: "success",
    message: message,
    data: data
  });
};

const errorResponse = (res, message, statusCode = 500) => {
  return res.json({
    statusCode,
    status: "error",
    message,
  });
};

const validationErrorResponse = (res, errors, message, statusCode = 400) => {
  return res.json({
    status: "fail",
    statusCode,
    message,
    errors,
  });
};

const successDataResponse = (res, message, data, result, statusCode = 200) => {
  return res.json({
    statusCode,
    status: "success",
    message: message,
    data: data,
    result :result
  });
};

module.exports = {
  successResponse,
  errorResponse,
  validationErrorResponse,
  successDataResponse
};