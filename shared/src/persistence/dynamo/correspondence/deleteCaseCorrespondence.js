const client = require('../../dynamodbClientService');
const {
  getCaseIdFromDocketNumber,
} = require('../cases/getCaseIdFromDocketNumber');

/**
 * deleteCaseCorrespondence
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case the correspondence is attached to
 * @param {string} providers.documentIdToDelete the id of the correspondence document to delete
 * @returns {Array<Promise>} the promises for the persistence delete calls
 */
exports.deleteCaseCorrespondence = async ({
  applicationContext,
  docketNumber,
  documentId,
}) => {
  const caseId = await getCaseIdFromDocketNumber({
    applicationContext,
    docketNumber,
  });

  return await client.delete({
    applicationContext,
    key: {
      pk: `case|${caseId}`,
      sk: `correspondence|${documentId}`,
    },
  });
};
