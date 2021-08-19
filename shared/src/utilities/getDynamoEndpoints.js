const AWS = require('aws-sdk');
const { DynamoDB } = AWS;

/**
 * getDynamoEndpoints
 *
 * @param {object} providers the providers object
 * @param {object} providers.fallbackRegion the region to fallback to
 * @param {object} providers.fallbackRegionEndpoint the endpoint of the fallback region
 * @param {object} providers.mainRegion the main region in use
 * @param {object} providers.mainRegionEndpoint the main region endpoint in use
 * @param {object} providers.masterDynamoDbEndpoint the master dynamo db endpoint in use
 * @param {object} providers.masterRegion the master region
 * @param {object} providers.useMasterRegion the flag indicating whether or not to use the master region
 * @returns {Object} the main region database and the fallback region database values
 */
exports.getDynamoEndpoints = ({
  fallbackRegion,
  fallbackRegionEndpoint,
  mainRegion,
  mainRegionEndpoint,
  masterDynamoDbEndpoint,
  masterRegion,
  useMasterRegion,
}) => {
  const mainRegionDB = new DynamoDB.DocumentClient({
    endpoint: useMasterRegion ? masterDynamoDbEndpoint : mainRegionEndpoint,
    region: useMasterRegion ? masterRegion : mainRegion,
  });

  const fallbackRegionDB = new DynamoDB.DocumentClient({
    endpoint: useMasterRegion ? fallbackRegionEndpoint : masterDynamoDbEndpoint,
    region: useMasterRegion ? fallbackRegion : masterRegion,
  });

  return { fallbackRegionDB, mainRegionDB };
};
