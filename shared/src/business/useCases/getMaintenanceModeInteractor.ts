/**
 * getMaintenanceModeInteractor
 *
 * @param {object} applicationContext the application context
 * @returns {boolean} the value of maintenance mode
 */
exports.getMaintenanceModeInteractor = async applicationContext => {
  const result = await applicationContext
    .getPersistenceGateway()
    .getMaintenanceMode({ applicationContext });
  return !!(result && result.current);
};
