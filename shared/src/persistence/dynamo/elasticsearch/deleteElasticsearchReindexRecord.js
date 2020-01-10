const client = require('../../dynamodbClientService');

/**
 * deleteElasticsearchReindexRecord
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.recordPk the pk of the record to add
 * @param {object} providers.recordSk the sk of the record to add
 */
exports.deleteElasticsearchReindexRecord = async ({
  applicationContext,
  recordPk,
  recordSk,
}) => {
  await client.delete({
    applicationContext,
    key: {
      pk: 'elasticsearch-reindex',
      sk: `${recordPk}-${recordSk}`,
    },
  });
};
