const client = require('../../dynamodbClientService');
const { uniq } = require('lodash');

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
  return await client.batchGet({
    applicationContext,
    keys: uniq(docketNumbers).map(docketNumber => ({
      pk: `case|${docketNumber}`,
      sk: `case|${docketNumber}`,
    })),
  });
};
