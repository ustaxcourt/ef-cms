import { getFromDeployTable } from '../../dynamodbClientService';

/**
 * getMaintenanceMode
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {Promise<string>} the value of the maintenance-mode flag on the dynamodb deploy table
 */
export const getMaintenanceMode = ({
  applicationContext,
}: {
  applicationContext: IApplicationContext;
}) =>
  getFromDeployTable({
    Key: {
      pk: 'maintenance-mode',
      sk: 'maintenance-mode',
    },
    applicationContext,
  });
