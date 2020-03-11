const client = require('../../dynamodbClientService');
const sinon = require('sinon');
const {
  getCasePrivatePractitioners,
} = require('./getCasePrivatePractitioners');

describe('getCasePrivatePractitioners', () => {
  let applicationContext;
  let queryStub;

  beforeEach(() => {
    queryStub = jest.fn().mockResolvedValue({ Items: [] });

    sinon.stub(client, 'query').resolves([
      {
        docketRecordId: 'abc-123',
        eventCode: 'P',
      },
    ]);

    applicationContext = {
      environment: {
        stage: 'local',
      },
      getDocumentClient: () => ({
        query: () => ({
          promise: queryStub,
        }),
      }),
    };
  });

  afterEach(() => {
    client.query.restore();
  });

  it('retrieves the privatePractitioners for a case', async () => {
    const result = await getCasePrivatePractitioners({ applicationContext })({
      caseId: 'abc-123',
    });

    expect(result).toMatchObject({
      caseId: 'abc-123',
      privatePractitioners: [],
    });
  });
});
