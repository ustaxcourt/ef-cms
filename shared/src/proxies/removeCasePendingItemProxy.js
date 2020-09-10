const { remove } = require('./requests');

/**
 * removeCasePendingItemInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case to update
 * @param {string} providers.docketEntryId the id of docket entry no longer pending
 * @returns {Promise<object>} the updated case data
 */
exports.removeCasePendingItemInteractor = ({
  applicationContext,
  docketEntryId,
  docketNumber,
}) => {
  return remove({
    applicationContext,
    endpoint: `/cases/${docketNumber}/remove-pending/${docketEntryId}`,
  });
};
