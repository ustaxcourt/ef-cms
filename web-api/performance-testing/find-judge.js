const AWS = require('aws-sdk');
const { getClient } = require('../elasticsearch/client');

// const mappings = require('../elasticsearch/elasticsearch-mappings');
// const { settings } = require('../elasticsearch/elasticsearch-settings');

const environmentName = process.argv[2] || 'exp1';
const version = process.argv[3] || 'alpha';

(async () => {
  const esClient = await getClient({ environmentName, version });

  let results = await esClient.search({
    body: {
      _source: ['signedJudgeName', 'docketEntryId', 'pk', 'sk'],
      query: {
        match: {
          'signedJudgeName.S': 'Diana Leyden',
        },
      },
    },
    index: 'efcms-docket-entry',
    size: 10000,
  });

  const dynamo = new AWS.DynamoDB({
    endpoint: 'dynamodb.us-east-1.amazonaws.com',
    region: 'us-east-1',
  });

  console.log(`total hits: ${results.hits.hits.length}`);

  if (results.hits.hits.length === 0) {
    console.log('nothing to do!');
  } else {
    const promises = results.hits.hits
      .filter(hit => {
        return hit['_source'].signedJudgeName.S === 'Diana Leyden'; // only worry about the ones that need updating
      })
      .map(hit => {
        // console.log(hit);
        const record = hit['_source'];
        const params = {
          ExpressionAttributeNames: {
            '#judgeName': 'signedJudgeName',
          },
          ExpressionAttributeValues: {
            ':judgeName': {
              S: 'Diana L. Leyden',
            },
          },
          Key: {
            pk: {
              S: record.pk.S,
            },
            sk: {
              S: record.sk.S,
            },
          },
          TableName: 'efcms-prod-beta',
          UpdateExpression: 'SET #judgeName = :judgeName',
        };
        console.log(params);
        // return true;
        return dynamo.updateItem(params).promise();
      });
    await Promise.all(promises);
    console.log(`updated ${promises.length}`);
  }

  // const hits = get(results, 'hits.hits');
  // const formatHit = hit => {
  //   return {
  //     ...AWS.DynamoDB.Converter.unmarshall(hit['_source']),
  //     score: hit['_score'],
  //   };
  // };

  // if (hits && hits.length > 0) {
  //   results = hits
  //     .map(formatHit)
  //     .map(hit =>
  //       pick(hit, [
  //         'score',
  //         'caseCaption',
  //         'docketNumberWithSuffix',
  //         'contactPrimary.name',
  //         'contactPrimary.secondaryName',
  //         'contactSecondary.name',
  //       ]),
  //     );
  // }
  // console.log(JSON.stringify(results, null, 2));
})();

/*

* Exact matches = exact words in the exact order
			   OR = exact word in any order

* If there are no exact matches, inform the user
* If there are no exact matches, user can perform a partial match search
* Partial match = any words in any order

*/
