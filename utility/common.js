
module.exports = {
  tryCatch: async (next, action) => {
    try {
      await action();
    } catch (error) {
      next(error);
    }
  },
  validator: (reqSchema, key = 'body') => {
    return async (req, _res, next) => {
      try {
        const newObj = await reqSchema.validateAsync(req[key], {
          abortEarly: true,
        });
        req.value = newObj;
        next();
      } catch (err) {
        next({ message: err.message, success: false, status: 422 });
      }
    };
  },
};