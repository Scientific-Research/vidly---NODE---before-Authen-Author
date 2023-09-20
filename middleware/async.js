// Note: when we use the module.exports here, we have to remove the name of the function which is: asyncMiddleware
module.exports = function (handler) {
  return async (req, res, next) => {
    try {
      // ...
      await handler(req, res);
    } catch (ex) {
      next(ex);
    }
  };
};
