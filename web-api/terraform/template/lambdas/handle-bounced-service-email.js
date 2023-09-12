const {
  handleBounceNotificationsLambda,
} = require('../../../src/lambdas/email/handleBounceNotificationsLambda');

exports.handler = handleBounceNotificationsLambda;
