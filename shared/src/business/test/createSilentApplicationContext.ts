import { createApplicationContext } from '../../../../web-api/src/applicationContext';

export const createSilentApplicationContext = user => {
  const applicationContext = createApplicationContext(user, {
    debug: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  });

  applicationContext.environment.dynamoDbTableName = 'mocked';
  applicationContext.getPersistenceGateway().getMaintenanceMode = jest
    .fn()
    .mockReturnValue(false);

  return applicationContext;
};
