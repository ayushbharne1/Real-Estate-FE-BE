// Validates req.body or req.query using shared Zod schemas.
// Same schemas as frontend — single source of truth.

export const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      status: "ERROR",
      message: "Validation failed",
      errors: result.error.flatten().fieldErrors,
    });
  }
  req.body = result.data;
  next();
};

export const validateQuery = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.query);
  if (!result.success) {
    return res.status(400).json({
      status: "ERROR",
      message: "Invalid query parameters",
      errors: result.error.flatten().fieldErrors,
    });
  }
  req.query = result.data;
  next();
};