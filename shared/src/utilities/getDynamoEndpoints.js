const AWS = require('aws-sdk');
const { DynamoDB } = AWS;

/**
 * deleteByGsi
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.gsi the gsi to search and delete
 * @returns {Promise} the promise of the call to persistence
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
