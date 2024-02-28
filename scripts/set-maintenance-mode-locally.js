import { sendMaintenanceNotificationsLambda } from '../web-api/src/lambdas/cases/sendMaintenanceNotificationsLambda';

const maintenanceMode = process.argv[2];

export const setMaintenanceModeLocally = async () => {
  await sendMaintenanceNotificationsLambda({
    maintenanceMode: maintenanceMode === 'true',
  });
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  await setMaintenanceModeLocally();
})();
