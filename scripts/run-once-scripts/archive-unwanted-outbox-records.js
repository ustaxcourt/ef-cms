// this script is going to query and then delete records so we can perform a migration

const {
  calculateISODate,
  createISODateAtStartOfDayEST,
  formatDateString,
  FORMATS,
} = require('../../shared/src/business/utilities/DateHandler');
const { DynamoDB } = require('aws-sdk');
const { getVersion } = require('../../shared/admin-tools/util');

const client = new DynamoDB({ region: 'us-east-1' });
const environmentName = process.argv[2] || 'exp1';

// sleep function to help with throttling
const sleep = ms =>
  new Promise(resolve => {
    setTimeout(resolve, ms);
  });

/**
 * Archive a work item onto another partition. Delete it from the original partition
 *
 * @param {Object} workItem the WorkItem to archive
 */
const archiveWorkItem = async ({ section, workItem }) => {
  const version = await getVersion(environmentName);
  const Key = {
    pk: workItem.pk,
    sk: workItem.sk,
  };
  const skDate = formatDateString(workItem.sk.S, FORMATS.YYYYMM);

  console.log(`Key to create section-outbox|${section}|${skDate}`);
  console.log(`Key to delete ${JSON.stringify(Key)}`);

  // archive onto new partition
  await client
    .putItem({
      Item: {
        ...workItem,
        pk: {
          S: `section-outbox|${section}|${skDate}`,
        },
      },
      TableName: `efcms-${environmentName}-${version}`,
    })
    .promise();

  // then delete from old partition
  await client
    .deleteItem({
      Key,
      TableName: `efcms-${environmentName}-${version}`,
    })
    .promise();
};

/**
 * Loop through a partition and archive records older than 7 days
 *
 * @param {Object} providers The providers object
 * @param {String} providers.LastEvaluatedKey A String to use for paginating the query
 * @param {string} providers.section The section we are archiving
 */
const moveOldRecords = async ({ LastEvaluatedKey = false, section }) => {
  const version = await getVersion(environmentName);
  const afterDate = calculateISODate({
    dateString: createISODateAtStartOfDayEST(),
    howMuch: -7,
    units: 'days',
  });

  // get all of the records older than 7 days
  const query = {
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':afterDate': { S: afterDate },
      ':pk': { S: `section-outbox|${section}` },
    },
    KeyConditionExpression: '#pk = :pk AND #sk < :afterDate',
    TableName: `efcms-${environmentName}-${version}`,
  };

  // If we have a pagination key, use it
  if (LastEvaluatedKey) query.ExclusiveStartKey = LastEvaluatedKey;

  const result = await client.query(query).promise();

  // Archive each item found
  await Promise.all(
    result.Items.map(workItem => archiveWorkItem({ section, workItem })),
  );

  // Recursively try again if we received a pagination key
  if (result.LastEvaluatedKey) {
    console.log('continue on with the next batch...');
    await sleep(1000);
    await moveOldRecords({
      LastEvaluatedKey: result.LastEvaluatedKey,
      section,
    });
  }
  console.log('all done');
};

(async () => {
  // go through each section and move the records
  for (const section of ['petitions', 'docket']) {
    await moveOldRecords({
      section,
    });
  }
})();
