const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const tableName = process.argv[2];
const regions = process.argv[3].split(',');
const dynamodb = new AWS.DynamoDB({
  region: regions[0],
});

async function processGlobalTables() {
  console.log('ProcessingGlobalTables: Start', tableName);
  try {
    const gt = await dynamodb
      .describeGlobalTable({
        GlobalTableName: tableName,
      })
      .promise();
    console.log('Found Global Table:', JSON.stringify(gt, null, 2));
    const unprocessedRegions = getUnprocessedRegions(gt);
    unprocessedRegions.length && (await updateGlobalTable(unprocessedRegions));
  } catch (err) {
    if (err.code !== 'GlobalTableNotFoundException') {
      console.error('ProcessGlobalTables: Error:', err);
      throw err;
    }
    await createGlobalTable();
  }
  console.log('ProcessGlobalTables: Done', tableName);
}

function getUnprocessedRegions(gt) {
  if (!gt.GlobalTableDescription.ReplicationGroup.length) {
    return regions;
  }
  const processedRegions = gt.GlobalTableDescription.ReplicationGroup.map(
    region => region.RegionName,
  );
  return regions.filter(region => !processedRegions.includes(region));
}

async function updateGlobalTable(unprocessedRegions) {
  const params = {
    GlobalTableName: tableName,
    ReplicaUpdates: unprocessedRegions.map(region => ({
      Create: {
        RegionName: region,
      },
    })),
  };
  console.log('updateGlobalTable', params);
  await dynamodb.updateGlobalTable(params).promise();
}

async function createGlobalTable() {
  const params = {
    GlobalTableName: tableName,
    ReplicationGroup: regions.map(region => ({
      RegionName: region,
    })),
  };
  console.log('createGlobalTable', params);
  await dynamodb.createGlobalTable(params).promise();
}

(async () => {
  try {
    await processGlobalTables();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
})();
