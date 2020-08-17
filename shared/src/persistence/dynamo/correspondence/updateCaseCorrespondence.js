const client = require('../../dynamodbClientService');

/**
 * updateCaseCorrespondence
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case the correspondence is attached to
 * @param {string} providers.documentIdToDelete the id of the correspondence document to update
 */
exports.updateCaseCorrespondence = async ({
  applicationContext,
  docketNumber,
  documentId,
}) => {
  await client.put({
    applicationContext,
    key: {
      pk: `case|${docketNumber}`,
      sk: `correspondence|${documentId}`,
    },
  });
};
