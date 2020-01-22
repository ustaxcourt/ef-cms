const client = require('../../dynamodbClientService');

/**
 * getRecord - get a generic record from dynamo to index in elasticsearch
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.recordPk the pk of the record to get
 * @param {object} providers.recordSk the sk of the record to get
 */
exports.getRecord = async ({ applicationContext, recordPk, recordSk }) => {
  return await client.get({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':pk': recordPk,
      ':sk': recordSk,
    },
    KeyConditionExpression: '#pk = :pk AND #sk = :sk',
    applicationContext,
  });
};
