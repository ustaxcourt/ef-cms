module.exports = {
  createUserLambda: require('./users/createUserLambda').handler,
  getInternalUsersLambda: require('./users/getInternalUsersLambda').handler,
};
