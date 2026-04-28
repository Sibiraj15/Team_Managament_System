export const errorHandler = (err, req, res, next) => {
  if (err.code === 11000) {
    const duplicateField = Object.keys(err.keyPattern || {})[0] || "field";
    return res.status(409).json({
      message: `${duplicateField} already exists`
    });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: Object.values(err.errors)
        .map((error) => error.message)
        .join(", ")
    });
  }

  const statusCode =
    err.statusCode || (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);

  res.status(statusCode).json({
    message: err.message || "Internal server error",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack
  });
};
