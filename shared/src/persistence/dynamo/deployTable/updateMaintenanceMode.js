const client = require('../../dynamodbClientService');

/**
 * updateMaintenanceMode
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {boolean} providers.maintenanceMode true to turn maintenance mode on, false otherwise
 */
exports.updateMaintenanceMode = async ({
  applicationContext,
  maintenanceMode,
}) => {
  await client.updateToDeployTable({
    ExpressionAttributeNames: {
      '#current': 'current',
    },
    ExpressionAttributeValues: {
      ':maintenanceMode': maintenanceMode,
    },
    Key: {
      pk: 'maintenance-mode',
      sk: 'maintenance-mode',
    },
    UpdateExpression: 'SET #current = :maintenanceMode',
    applicationContext,
  });
};
