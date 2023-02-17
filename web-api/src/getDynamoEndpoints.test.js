const { getDynamoEndpoints } = require('./getDynamoEndpoints');

describe('getDynamoEndpoints', () => {
  let mockEnvironment = {
    dynamoDbEndpoint: '',
    masterRegion: 'us-east-1',
    region: 'us-east-1',
  };
  let mainRegion;
  let fallbackRegion;
  let mainRegionEndpoint;
  let fallbackRegionEndpoint;

  beforeEach(() => {
    mainRegion = mockEnvironment.region;
    fallbackRegion =
      mockEnvironment.region === 'us-west-1' ? 'us-east-1' : 'us-west-1';
    mainRegionEndpoint = mockEnvironment.dynamoDbEndpoint.includes('localhost')
      ? 'http://localhost:8000'
      : `dynamodb.${mainRegion}.amazonaws.com`;
    fallbackRegionEndpoint = mockEnvironment.dynamoDbEndpoint.includes(
      'localhost',
    )
      ? 'http://localhost:8000'
      : `dynamodb.${fallbackRegion}.amazonaws.com`;
  });

  const { masterDynamoDbEndpoint, masterRegion } = mockEnvironment;

  it('sets the fallbackRegionDB to us-east-1 when useMasterRegion is true', async () => {
    const result = getDynamoEndpoints({
      fallbackRegion,
      fallbackRegionEndpoint,
      mainRegion,
      mainRegionEndpoint,
      masterDynamoDbEndpoint,
      masterRegion,
      useMasterRegion: true,
    });

    await expect(result.fallbackRegionDB.config.region()).resolves.toEqual(
      'us-west-1',
    );

    await expect(result.fallbackRegionDB.config.endpoint()).resolves.toEqual(
      'dynamodb.us-west-1.amazonaws.com',
    );
  });

  it('sets the fallbackRegionDB to us-east-1 when useMasterRegion is false', async () => {
    const result = getDynamoEndpoints({
      fallbackRegion,
      fallbackRegionEndpoint,
      mainRegion,
      mainRegionEndpoint,
      masterDynamoDbEndpoint,
      masterRegion,
      useMasterRegion: false,
    });

    await expect(result.fallbackRegionDB.config.region()).resolves.toEqual(
      'us-east-1',
    );
  });
});
