// const validate = (req, res, next) => {
// const validate = (validator) => {
module.exports = (validator) => {
  return (req, res, next) => {
    // const { error } = validateReturn(req.body);
    const { error } = validator(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    next();
  };
};
