const handelerr = (err, req, res, next) => {
  let transformed;
  let errtransformed;
  transformed = err.summary();
  errtransformed = { msg: transformed[0].message };

  return res.status(err.statusCode).send(errtransformed);
};
module.exports = { handelerr };
