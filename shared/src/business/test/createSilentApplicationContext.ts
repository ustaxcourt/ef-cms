import { serverApplicationContext } from '../../../../web-api/src/applicationContext';

export const createSilentApplicationContext = user => {
  serverApplicationContext.setCurrentUser(user);
  const applicationContext = serverApplicationContext;

  applicationContext.environment.dynamoDbTableName = 'mocked';
  applicationContext.getPersistenceGateway().getMaintenanceMode = jest
    .fn()
    .mockReturnValue(false);

  return applicationContext;
};
