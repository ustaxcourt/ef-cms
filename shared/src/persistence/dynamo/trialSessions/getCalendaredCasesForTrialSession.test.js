const client = require('../../dynamodbClientService');
const sinon = require('sinon');
const {
  getCalendaredCasesForTrialSession,
} = require('./getCalendaredCasesForTrialSession');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('getCalendaredCasesForTrialSession', () => {
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
      { ...MOCK_CASE, disposition: 'something', removedFromTrial: true },
    ]);
  });

  it('should get the cases calendared for a trial session and the case notes if a userId is passed in', async () => {
    const applicationContext = {
      environment: {
        stage: 'dev',
      },
    };
    const result = await getCalendaredCasesForTrialSession({
      applicationContext,
      userId: '123',
    });
    expect(result).toMatchObject([
      {
        ...MOCK_CASE,
        disposition: 'something',
        notes: { notes: 'hey this is a note' },
        removedFromTrial: true,
      },
    ]);
  });
});
