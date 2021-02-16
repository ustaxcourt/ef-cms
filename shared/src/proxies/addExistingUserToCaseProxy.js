const { post } = require('./requests');

/**
 * addExistingUserToCaseInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case
 * @param {string} providers.docketEntryId the docket entry id to archive
 * @returns {Promise<*>} the promise of the api call
 */
exports.addExistingUserToCaseInteractor = ({
  applicationContext,
  docketNumber,
  email,
  name,
}) => {
  return post({
    applicationContext,
    body: {
      email,
      name,
    },
    endpoint: `/cases/${docketNumber}/add-existing-user`,
  });
};
