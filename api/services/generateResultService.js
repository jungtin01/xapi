module.exports = {
  fail: function(message) {
    return {
      status: 'fail',
      message: message,
      result: {}
    }
  },
  success: function(data) {
    return {
      status: 'success',
      result: data
    }
  }
};
