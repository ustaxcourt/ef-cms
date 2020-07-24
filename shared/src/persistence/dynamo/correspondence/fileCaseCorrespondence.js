const {
  getCaseIdFromDocketNumber,
} = require('../cases/getCaseIdFromDocketNumber');
const { put } = require('../../dynamodbClientService');

/**
 * fileCaseCorrespondence
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the associated case docket number
 * @param {object} providers.correspondence the correspondence data
 * @returns {Promise} the promise of the call to persistence
 */
exports.fileCaseCorrespondence = async ({
  applicationContext,
  correspondence,
  docketNumber,
}) => {
  const caseId = await getCaseIdFromDocketNumber({
    applicationContext,
    docketNumber,
  });

  return await put({
    Item: {
      pk: `case|${caseId}`,
      sk: `correspondence|${correspondence.documentId}`,
      ...correspondence,
    },
    applicationContext,
  });
};
