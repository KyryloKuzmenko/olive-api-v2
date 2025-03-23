export const validateBody = (schema) => {
  return (req, res, next) => {
    try {
      const { error } = schema.validate(req.body, { abortEarly: false });

      if (error) {
        const err = new Error(
          `Validation error: ${error.details.map((d) => d.message).join(", ")}`
        );
        err.statusCode = 400;
        throw err;
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
