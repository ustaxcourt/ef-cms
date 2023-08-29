const {
  sendMaintenanceNotificationsLambda,
} = require('../../../src/cases/lambdas/sendMaintenanceNotificationsLambda');

exports.handler = sendMaintenanceNotificationsLambda;
