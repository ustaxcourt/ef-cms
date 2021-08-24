const { genericHandler } = require('../genericHandler');

/**
 * lambda which is used to send notifications to all users when maintenance mode is engaged
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.sendMaintenanceNotificationsLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await applicationContext
        .getUseCases()
        .sendMaintenanceNotificationsInteractor(applicationContext);
    },
    {
      user: {},
    },
  );
