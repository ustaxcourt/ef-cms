const createApplicationContext = require('../../../../web-api/src/applicationContext');

module.exports = user => {
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
