const client = require('../../dynamodbClientService');

/**
 * deleteDocument
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.docketNumber the docket number of the record to delete from
 * @param {object} providers.documentId the documentId of the record to delete
 */
exports.deleteDocument = async ({
  applicationContext,
  docketNumber,
  documentId,
}) => {
  await client.delete({
    applicationContext,
    key: {
      pk: `case|${docketNumber}`,
      sk: `document|${documentId}`,
    },
  });
};
