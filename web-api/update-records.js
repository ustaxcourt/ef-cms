// this could potentially be used for the start of a migration script

const AWS = require('aws-sdk');
const {
  COUNTRY_TYPES,
} = require('../shared/src/business/entities/EntityConstants');

const documentClient = new AWS.DynamoDB.DocumentClient({
  endpoint: 'dynamodb.us-east-1.amazonaws.com',
  region: 'us-east-1',
});

(async function () {
  let hasMoreResults = true;
  let lastKey = null;
  while (hasMoreResults) {
    hasMoreResults = false;

    await documentClient
      .scan({
        ExclusiveStartKey: lastKey,
        TableName: 'efcms-stg',
      })
      .promise()
      .then(async results => {
        hasMoreResults = !!results.LastEvaluatedKey;
        lastKey = results.LastEvaluatedKey;
        const recordsUpdated = [];
        for (const result of results.Items) {
          if (result.irsPractitioners) {
            result.irsPractitioners = result.irsPractitioners.map(r => ({
              ...r,
              contact: {
                address1: '234 Main St',
                address2: 'Apartment 4',
                address3: 'Under the stairs',
                city: 'Chicago',
                countryType: COUNTRY_TYPES.DOMESTIC,
                phone: '+1 (555) 555-5555',
                postalCode: '61234',
                state: 'IL',
              },
            }));
          }

          if (result.privatePractitioners) {
            result.privatePractitioners = result.privatePractitioners.map(
              p => ({
                ...p,
                contact: {
                  address1: '234 Main St',
                  address2: 'Apartment 4',
                  address3: 'Under the stairs',
                  city: 'Chicago',
                  countryType: COUNTRY_TYPES.DOMESTIC,
                  phone: '+1 (555) 555-5555',
                  postalCode: '61234',
                  state: 'IL',
                },
              }),
            );
          }

          if (result.irsPractitioners || result.privatePractitioners) {
            console.log('updating a case');
            await recordsUpdated.push(
              documentClient
                .put({
                  Item: result,
                  TableName: 'efcms-stg',
                })
                .promise(),
            );
          }
        }
      });
  }
})();
