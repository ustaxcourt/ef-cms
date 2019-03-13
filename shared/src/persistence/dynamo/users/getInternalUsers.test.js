const sinon = require('sinon');
const client = require('ef-cms-shared/src/persistence/dynamodbClientService');

const { getInternalUsers } = require('./getInternalUsers');

const applicationContext = {
  environment: {
    stage: 'local',
  },
  filterCaseMetadata: ({ cases }) => cases,
  isAuthorizedForWorkItems: () => true,
};

describe('getInternalUsers', () => {
  beforeEach(() => {
    sinon.stub(client, 'query').resolves([
      {
        pk: 'petitions|user',
        userId: 'petitionsclerk1',
      },
      {
        pk: 'docket|user',
        userId: 'docketclerk1',
      },
      {
        pk: 'seniorattorney|user',
        userId: 'seniorattorney1',
      },
    ]);

    sinon.stub(client, 'batchGet').resolves([
      {
        pk: 'petitions|user',
        userId: 'petitionsclerk1',
      },
      {
        pk: 'docket|user',
        userId: 'docketclerk1',
      },
      {
        pk: 'seniorattorney|user',
        userId: 'seniorattorney1',
      },
    ]);
  });

  afterEach(() => {
    client.query.restore();
  });

  it('should get the internal users', async () => {
    const result = await getInternalUsers({
      applicationContext,
    });
    expect(result.length).toEqual(9);
  });
});
