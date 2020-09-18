const client = require('../../dynamodbClientService');

/**
 * deleteDocketEntry
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.docketNumber the docket number of the record to delete from
 * @param {object} providers.docketEntryId the docketEntryId of the record to delete
 */
exports.deleteDocketEntry = async ({
  applicationContext,
  docketEntryId,
  docketNumber,
}) => {
  await client.delete({
    applicationContext,
    key: {
      pk: `case|${docketNumber}`,
      sk: `docket-entry|${docketEntryId}`,
    },
  });
};
