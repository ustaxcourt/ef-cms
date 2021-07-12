const {
  getDynamoEndpoints,
} = require('../../shared/src/utilities/getDynamoEndpoints');

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
  const { fallbackRegionDB, mainRegionDB } = getDynamoEndpoints({
    fallbackRegion,
    fallbackRegionEndpoint,
    key,
    mainRegion,
    mainRegionEndpoint,
    masterDynamoDbEndpoint,
    masterRegion,
    useMasterRegion,
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
