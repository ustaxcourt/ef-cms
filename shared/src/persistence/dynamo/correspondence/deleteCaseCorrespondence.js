const client = require('../../dynamodbClientService');

/**
 * deleteCaseCorrespondence
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case the correspondence is attached to
 * @param {string} providers.documentIdToDelete the id of the correspondence document to delete
 * @returns {Array<Promise>} the promises for the persistence delete calls
 */
exports.deleteCaseCorrespondence = async ({
  applicationContext,
  caseId,
  documentId,
}) => {
  return await client.delete({
    applicationContext,
    key: {
      pk: `case|${caseId}`,
      sk: `correspondence|${documentId}`,
    },
  });
};
