export const success = (res, data, statusCode = 200) =>
  res.status(statusCode).json({ status: "SUCCESS", data });

export const error = (res, message, statusCode = 500) =>
  res.status(statusCode).json({ status: "ERROR", message });