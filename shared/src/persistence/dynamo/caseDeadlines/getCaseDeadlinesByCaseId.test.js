const client = require('../../../../../shared/src/persistence/dynamodbClientService');
const sinon = require('sinon');
const { getCaseDeadlinesByCaseId } = require('./getCaseDeadlinesByCaseId');

const applicationContext = {
  environment: {
    stage: 'local',
  },
};

const mockCaseDeadline = {
  caseDeadlineId: '6805d1ab-18d0-43ec-bafb-654e83405416',
  caseId: 'e08f2474-9647-4542-b724-3c347c344087',
  deadlineDate: '2019-03-01T21:42:29.073Z',
  description: 'hello world',
};

describe('getCaseDeadlinesByCaseId', () => {
  beforeEach(() => {
    sinon.stub(client, 'batchGet').resolves([
      {
        ...mockCaseDeadline,
        pk: mockCaseDeadline.caseDeadlineId,
        sk: mockCaseDeadline.caseDeadlineId,
      },
    ]);
    sinon.stub(client, 'query').resolves([
      {
        pk: `${mockCaseDeadline.caseId}|case-deadline`,
        sk: mockCaseDeadline.caseDeadlineId,
      },
    ]);
  });

  afterEach(() => {
    client.batchGet.restore();
    client.query.restore();
  });

  it('should return data as received from persistence', async () => {
    const result = await getCaseDeadlinesByCaseId({
      applicationContext,
      caseId: mockCaseDeadline.caseId,
    });
    expect(result).toEqual([
      {
        caseDeadlineId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        caseId: 'e08f2474-9647-4542-b724-3c347c344087',
        deadlineDate: '2019-03-01T21:42:29.073Z',
        description: 'hello world',
        pk: '6805d1ab-18d0-43ec-bafb-654e83405416',
        sk: '6805d1ab-18d0-43ec-bafb-654e83405416',
      },
    ]);
  });

  it('should attempt to do a batch get in the same ids that were returned in the mapping records', async () => {
    await getCaseDeadlinesByCaseId({
      applicationContext,
      caseId: mockCaseDeadline.caseId,
    });
    expect(client.batchGet.getCall(0).args[0].keys).toEqual([
      {
        pk: '6805d1ab-18d0-43ec-bafb-654e83405416',
        sk: '6805d1ab-18d0-43ec-bafb-654e83405416',
      },
    ]);
  });
});
