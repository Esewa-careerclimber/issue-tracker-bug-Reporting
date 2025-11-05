export function validate(fields) {
  return (req, res, next) => {
    for (const field of fields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `Missing field: ${field}` });
      }
    }
    next();
  };
}