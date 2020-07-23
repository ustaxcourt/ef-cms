const {
  getCaseIdFromDocketNumber,
} = require('../cases/getCaseIdFromDocketNumber');
const { getRecordsViaMapping } = require('../helpers/getRecordsViaMapping');

/**
 * getCaseDeadlinesByDocketNumber
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case to get the case deadlines for
 * @returns {Promise} the promise of the persistence call to get the records
 */
exports.getCaseDeadlinesByDocketNumber = async ({
  applicationContext,
  docketNumber,
}) => {
  const caseId = await getCaseIdFromDocketNumber({
    applicationContext,
    docketNumber,
  });

  if (caseId) {
    return await getRecordsViaMapping({
      applicationContext,
      pk: `case|${caseId}`,
      prefix: 'case-deadline',
    });
  }
};
