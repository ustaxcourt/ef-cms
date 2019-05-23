/**
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.checkForReadyForTrialCases = async ({ applicationContext }) => {
  applicationContext.logger.info('Time', new Date().toISOString());
};
