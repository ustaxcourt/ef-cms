const client = require('../../dynamodbClientService');
const { getCaseIdFromDocketNumber } = require('./getCaseIdFromDocketNumber');

/**
 * getCasesByDocketNumbers
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Array} providers.docketNumbers the docket numbers to get
 * @returns {Array} the case details
 */
exports.getCasesByDocketNumbers = async ({
  applicationContext,
  docketNumbers,
}) => {
  const caseIds = await Promise.all(
    docketNumbers.map(docketNumber =>
      getCaseIdFromDocketNumber({ applicationContext, docketNumber }),
    ),
  );

  return await client.batchGet({
    applicationContext,
    keys: caseIds.map(id => ({
      pk: `case|${id}`,
      sk: `case|${id}`,
    })),
  });
};
