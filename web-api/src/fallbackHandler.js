const AWS = require('aws-sdk');
const { DynamoDB } = AWS;

const fallbackHandler = ({
  fallbackRegion,
  fallbackRegionEndpoint,
  key,
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

  return params => {
    return {
      promise: () =>
        new Promise((resolve, reject) => {
          mainRegionDB[key](params)
            .promise()
            .catch(err => {
              if (
                err.code === 'ResourceNotFoundException' ||
                err.statusCode === 503
              ) {
                return fallbackRegionDB[key](params).promise();
              }
              throw err;
            })
            .then(resolve)
            .catch(reject);
        }),
    };
  };
};

module.exports.fallbackHandler = fallbackHandler;
