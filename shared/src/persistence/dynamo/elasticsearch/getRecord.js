const client = require('../../dynamodbClientService');

/**
 * getRecord - get a generic record from dynamo to index in elasticsearch
 *
 * @param {object} arguments deconstructed arguments
 * @param {object} arguments.applicationContext the application context
 * @param {string} arguments.recordPk the pk of the record to get
 * @param {string} arguments.recordSk the sk of the record to get
 * @returns {Promise} resolves with result of query
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
