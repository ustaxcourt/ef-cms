const client = require('../../dynamodbClientService');

/**
 * createElasticsearchReindexRecord
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.recordPk the pk of the record to add
 * @param {object} providers.recordSk the sk of the record to add
 */
exports.createElasticsearchReindexRecord = async ({
  applicationContext,
  recordPk,
  recordSk,
}) => {
  await client.put({
    Item: {
      pk: 'elasticsearch-reindex',
      recordPk,
      recordSk,
      sk: `${recordPk}-${recordSk}`,
    },
    applicationContext,
  });
};
