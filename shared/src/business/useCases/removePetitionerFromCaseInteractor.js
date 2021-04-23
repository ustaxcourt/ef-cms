/**
 * used to remove a petitioner from a case
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.contactId the contactId of the person to remove from the case
 * @param {string} providers.docketNumber the docket number of the case
 * @returns {object} the case data
 */
exports.removePetitionerFromCaseInteractor = async (
  applicationContext,
  { contactId, docketNumber },
) => {};
