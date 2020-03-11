const client = require('../../../../../shared/src/persistence/dynamodbClientService');
const sinon = require('sinon');
const { getCaseDocketRecord } = require('./getCaseDocketRecord');

describe('getCaseDocketRecord', () => {
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

  it('retrieves the docket record for a case', async () => {
    const result = await getCaseDocketRecord({ applicationContext })({
      caseId: 'abc-123',
    });

    expect(result).toMatchObject({
      caseId: 'abc-123',
      docketRecord: [],
    });
  });
});
