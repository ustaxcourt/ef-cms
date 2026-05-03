import { createApplicationContext } from '../../../../web-api/src/applicationContext';

export const createSilentApplicationContext = user => {
  const applicationContext = createApplicationContext(user);

  applicationContext.getPersistenceGateway().getMaintenanceMode = jest
    .fn()
    .mockReturnValue(false);

  return applicationContext;
};
