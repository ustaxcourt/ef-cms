const client = require('../../dynamodbClientService');
const sinon = require('sinon');
const {
  getCalendaredCasesForTrialSession,
} = require('./getCalendaredCasesForTrialSession');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('getCalendaredCasesForTrialSession', () => {
  const mockDocketRecord = [
    {
      docketRecordId: '2f2062a4-e019-441d-9aed-775b8d2ad1c0',
      documentId: 'e23e1ab7-9559-4adc-8b0b-daf60dbbbd52',
      index: 0,
      pk: 'case|c54ba5a9-b37b-479d-9201-067ec6e335bb',
      sk: 'docket-record|2f2062a4-e019-441d-9aed-775b8d2ad1c0',
    },
  ];

  beforeEach(() => {
    sinon.stub(client, 'get').resolves({
      caseOrder: [
        {
          caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          disposition: 'something',
          removedFromTrial: true,
        },
      ],
    });

    sinon
      .stub(client, 'batchGet')
      .onCall(0)
      .resolves([{ ...MOCK_CASE, pk: MOCK_CASE.caseId }])
      .onCall(1)
      .resolves([
        {
          caseId: MOCK_CASE.caseId,
          notes: 'hey this is a note',
          pk: `judges-case-note|${MOCK_CASE.caseId}`,
          sk: '123',
        },
      ]);

    sinon.stub(client, 'query').resolves(mockDocketRecord);
  });

  afterEach(() => {
    client.get.restore();
    client.batchGet.restore();
  });

  it('should get the cases calendared for a trial session', async () => {
    const applicationContext = {
      environment: {
        stage: 'dev',
      },
    };
    const result = await getCalendaredCasesForTrialSession({
      applicationContext,
    });
    expect(result).toMatchObject([
      {
        ...MOCK_CASE,
        disposition: 'something',
        docketRecord: mockDocketRecord,
        removedFromTrial: true,
      },
    ]);
  });
});
