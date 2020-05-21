const { put } = require('../../dynamodbClientService');

/**
 * fileCaseCorrespondence
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the associated case id
 * @param {object} providers.correspondence the correspondence data
 * @returns {Promise} the promise of the call to persistence
 */
exports.fileCaseCorrespondence = async ({
  applicationContext,
  caseId,
  correspondence,
}) => {
  return await put({
    Item: {
      pk: `case|${caseId}`,
      sk: `correspondence|${correspondence.documentId}`,
      ...correspondence,
    },
    applicationContext,
  });
};
