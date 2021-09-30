const client = require('../../dynamodbClientService');

/**
 * getMaintenanceMode
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {Promise<string>} the value of the maintenance-mode flag on the dynamodb deploy table
 */
exports.getMaintenanceMode = async ({ applicationContext }) => {
  const result = await client.getFromDeployTable({
    Key: {
      pk: 'maintenance-mode',
      sk: 'maintenance-mode',
    },
    applicationContext,
  });

  return result.current;
};
