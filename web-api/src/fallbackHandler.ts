const { getDynamoEndpoints } = require('./getDynamoEndpoints');

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
    return mainRegionDB[key](params).catch(err => {
      if (err.code === 'ResourceNotFoundException' || err.statusCode === 503) {
        return fallbackRegionDB[key](params);
      }
      throw err;
    });
  };
};

module.exports.fallbackHandler = fallbackHandler;
