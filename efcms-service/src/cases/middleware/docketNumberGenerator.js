const client = require('../../middleware/dynamodbClientService');

const TABLE_NAME = process.env.STAGE ? `efcms-cases-${process.env.STAGE}` : 'efcms-cases-dev';

/**
 * createDocketNumber
 *
 * creates a docket number by incrementing the value
 * in the datastore
 *
 * @returns {Promise.<string>}
 */
exports.createDocketNumber = async () => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      caseId: 'docketNumberCounter'
    },
    UpdateExpression: 'ADD #a :x',
    ExpressionAttributeNames: {
      '#a' : "id"
    },
    ExpressionAttributeValues: {
      ':x' : 1
    },
    ReturnValues: "UPDATED_NEW"
  };

  const id = await client.updateConsistent(params);

  const plus100 = id + 100;
  const last2YearDigits = new Date().getFullYear().toString().substr(-2);
  const pad = `00000${plus100}`.substr(-5);

  return `${pad}-${last2YearDigits}`;

};