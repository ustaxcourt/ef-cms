const { deleteByGsi } = require('../helpers/deleteByGsi');

/**
 * deleteUserConnection
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.connectionId the websocket connection id
 * @returns {Promise} the promise of the call to persistence
 */
exports.deleteUserConnection = async ({ applicationContext, connectionId }) => {
  /**
   * Only one record should be found at most.
   * You can't delete for a gsi,
   * So a query is needed to gather pk/sk
   */
  await deleteByGsi({ applicationContext, gsi: connectionId });
};
