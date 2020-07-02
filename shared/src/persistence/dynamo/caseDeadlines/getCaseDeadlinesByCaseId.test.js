const client = require('../../../../../shared/src/persistence/dynamodbClientService');
const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { getCaseDeadlinesByCaseId } = require('./getCaseDeadlinesByCaseId');

const mockCaseDeadline = {
  caseDeadlineId: '6805d1ab-18d0-43ec-bafb-654e83405416',
  caseId: 'e08f2474-9647-4542-b724-3c347c344087',
  deadlineDate: '2019-03-01T21:42:29.073Z',
  description: 'hello world',
};

describe('getCaseDeadlinesByCaseId', () => {
  beforeEach(() => {
    client.batchGet = jest.fn().mockReturnValue([
      {
        ...mockCaseDeadline,
        pk: `case-deadline|${mockCaseDeadline.caseDeadlineId}`,
        sk: `case-deadline|${mockCaseDeadline.caseDeadlineId}`,
      },
    ]);
    client.query = jest.fn().mockReturnValue([
      {
        pk: `case|${mockCaseDeadline.caseId}`,
        sk: `case-deadline|${mockCaseDeadline.caseDeadlineId}`,
      },
    ]);
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
        pk: 'case-deadline|6805d1ab-18d0-43ec-bafb-654e83405416',
        sk: 'case-deadline|6805d1ab-18d0-43ec-bafb-654e83405416',
      },
    ]);
  });

  it('should attempt to do a batch get in the same ids that were returned in the mapping records', async () => {
    await getCaseDeadlinesByCaseId({
      applicationContext,
      caseId: mockCaseDeadline.caseId,
    });
    expect(client.batchGet.mock.calls[0][0].keys).toEqual([
      {
        pk: 'case-deadline|6805d1ab-18d0-43ec-bafb-654e83405416',
        sk: 'case-deadline|6805d1ab-18d0-43ec-bafb-654e83405416',
      },
    ]);
  });
});
