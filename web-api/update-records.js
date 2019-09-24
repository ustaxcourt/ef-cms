// this could potentially be used for the start of a migration script

const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient({
  endpoint: 'dynamodb.us-east-1.amazonaws.com',
  region: 'us-east-1',
});

(async function() {
  let hasMoreResults = true;
  let lastKey = null;
  let count = 0;
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
          if (result.respondents) {
            result.respondents = result.respondents.map(r => ({
              ...r,
              contact: {
                address1: '234 Main St',
                address2: 'Apartment 4',
                address3: 'Under the stairs',
                city: 'Chicago',
                countryType: 'domestic',
                phone: '+1 (555) 555-5555',
                postalCode: '61234',
                state: 'IL',
              },
            }));
          }

          if (result.practitioners) {
            result.practitioners = result.practitioners.map(p => ({
              ...p,
              contact: {
                address1: '234 Main St',
                address2: 'Apartment 4',
                address3: 'Under the stairs',
                city: 'Chicago',
                countryType: 'domestic',
                phone: '+1 (555) 555-5555',
                postalCode: '61234',
                state: 'IL',
              },
            }));
          }

          if (result.respondents || result.practitioners) {
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
