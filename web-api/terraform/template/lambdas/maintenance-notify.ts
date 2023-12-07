const {
  sendMaintenanceNotificationsLambda,
} = require('../../../src/lambdas/cases/sendMaintenanceNotificationsLambda');

exports.handler = sendMaintenanceNotificationsLambda;
