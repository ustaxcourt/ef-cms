const { getDynamoEndpoints } = require('./getDynamoEndpoints');

jest.mock('@aws-sdk/lib-dynamodb', () => {
  return {
    DynamoDBDocument: {
      from() {},
    },
  };
});

const mockDynamoDB = jest.fn();

jest.mock('@aws-sdk/client-dynamodb', () => {
  class DynamoDBClass {
    constructor(config) {
      mockDynamoDB(config);
    }
  }

  return {
    DynamoDB: DynamoDBClass,
  };
});

describe('getDynamoEndpoints', () => {
  let mockEnvironment = {
    dynamoDbEndpoint: '',
    masterDynamoDbEndpoint: 'dynamodb.us-east-1.amazonaws.com',
    masterRegion: 'us-east-1',
    region: 'us-east-1',
  };
  let mainRegion;
  let fallbackRegion;
  let mainRegionEndpoint;
  let fallbackRegionEndpoint;

  const { masterDynamoDbEndpoint, masterRegion } = mockEnvironment;

  beforeEach(() => {
    mainRegion = 'us-east-1';
    fallbackRegion = 'us-west-1';
    mainRegionEndpoint = `dynamodb.${mainRegion}.amazonaws.com`;
    fallbackRegionEndpoint = `dynamodb.${fallbackRegion}.amazonaws.com`;
  });

  it('sets the fallbackRegionDB to us-east-1 when useMasterRegion is true', async () => {
    getDynamoEndpoints({
      fallbackRegion,
      fallbackRegionEndpoint,
      mainRegion,
      mainRegionEndpoint,
      masterDynamoDbEndpoint,
      masterRegion,
      useMasterRegion: true,
    });

    expect(mockDynamoDB.mock.calls[0][0].region).toEqual('us-east-1');
    expect(mockDynamoDB.mock.calls[0][0].endpoint).toEqual(
      'dynamodb.us-east-1.amazonaws.com',
    );

    expect(mockDynamoDB.mock.calls[1][0].region).toEqual('us-west-1');
    expect(mockDynamoDB.mock.calls[1][0].endpoint).toEqual(
      'dynamodb.us-west-1.amazonaws.com',
    );
  });

  it('sets the fallbackRegionDB to us-east-1 when useMasterRegion is false', async () => {
    getDynamoEndpoints({
      fallbackRegion,
      fallbackRegionEndpoint,
      mainRegion,
      mainRegionEndpoint,
      masterDynamoDbEndpoint,
      masterRegion,
      useMasterRegion: false,
    });

    expect(mockDynamoDB.mock.calls[0][0].region).toEqual('us-east-1');
    expect(mockDynamoDB.mock.calls[0][0].endpoint).toEqual(
      'dynamodb.us-east-1.amazonaws.com',
    );

    expect(mockDynamoDB.mock.calls[1][0].region).toEqual('us-east-1');
    expect(mockDynamoDB.mock.calls[1][0].endpoint).toEqual(
      'dynamodb.us-east-1.amazonaws.com',
    );
  });
});
