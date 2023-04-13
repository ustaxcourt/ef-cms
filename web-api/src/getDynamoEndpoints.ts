import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { NodeHttpHandler } from '@aws-sdk/node-http-handler';

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
  const baseConfig = {
    maxAttempts: 3,
    requestHandler: new NodeHttpHandler({
      requestTimeout: 3000,
    }),
  };

  const options = {
    marshallOptions: {
      removeUndefinedValues: true,
    },
    unmarshallOptions: {
      wrapNumbers: false,
    },
  };

  const mainRegionDB = DynamoDBDocumentClient.from(
    new DynamoDBClient({
      ...baseConfig,
      endpoint: useMasterRegion ? masterDynamoDbEndpoint : mainRegionEndpoint,
      region: useMasterRegion ? masterRegion : mainRegion,
    }),
    options,
  );

  const fallbackRegionDB = DynamoDBDocumentClient.from(
    new DynamoDBClient({
      ...baseConfig,
      endpoint: useMasterRegion
        ? fallbackRegionEndpoint
        : masterDynamoDbEndpoint,
      region: useMasterRegion ? fallbackRegion : masterRegion,
    }),
    options,
  );

  return { fallbackRegionDB, mainRegionDB };
};
