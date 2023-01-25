module.exports.errorRes = (res, code, message) => {
  return res.status(code).json({
    status: 'error',
    error: {
      code,
      message,
    },
  });
};

module.exports.successRes = (res, data) => {
  return res.json({
    status: 'success',
    data,
  });
};
