const client = require('../../dynamodbClientService');

/**
 * updateMaintenanceMode
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 */
exports.updateMaintenanceMode = async ({
  applicationContext,
  maintenanceMode,
}) => {
  await client.update({
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
