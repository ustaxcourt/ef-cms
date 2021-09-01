/**
 * getMaintenanceModeInteractor
 *
 * @param {object} applicationContext the application context
 * @returns {boolean} the value of maintenance mode
 */
exports.getMaintenanceModeInteractor = async applicationContext => {
  return await applicationContext
    .getPersistenceGateway()
    .getMaintenanceMode({ applicationContext });
};
