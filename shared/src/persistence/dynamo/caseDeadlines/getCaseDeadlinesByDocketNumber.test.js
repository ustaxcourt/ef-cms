const client = require('../../dynamodbClientService');
const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  getCaseDeadlinesByDocketNumber,
} = require('./getCaseDeadlinesByDocketNumber');

const CASE_ID = 'df5a7b54-e2e7-4fe1-8f3e-86c838a16534';
const mockCaseDeadline = {
  caseDeadlineId: '6805d1ab-18d0-43ec-bafb-654e83405416',
  deadlineDate: '2019-03-01T21:42:29.073Z',
  description: 'hello world',
  docketNumber: '123-20',
};

describe('getCaseDeadlinesByDocketNumber', () => {
  beforeEach(() => {
    client.batchGet = jest.fn().mockReturnValue([
      {
        ...mockCaseDeadline,
        pk: `case-deadline|${mockCaseDeadline.caseDeadlineId}`,
        sk: `case-deadline|${mockCaseDeadline.caseDeadlineId}`,
      },
    ]);
    client.query = jest
      .fn()
      .mockReturnValueOnce([
        {
          pk: `case|${CASE_ID}`,
          sk: `case|${CASE_ID}`,
        },
      ])
      .mockReturnValueOnce([
        {
          pk: `case|${mockCaseDeadline.caseId}`,
          sk: `case-deadline|${mockCaseDeadline.caseDeadlineId}`,
        },
      ]);
  });

  it('should return data as received from persistence', async () => {
    const result = await getCaseDeadlinesByDocketNumber({
      applicationContext,
      docketNumber: mockCaseDeadline.docketNumber,
    });
    expect(result).toEqual([
      {
        caseDeadlineId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        deadlineDate: '2019-03-01T21:42:29.073Z',
        description: 'hello world',
        docketNumber: '123-20',
        pk: 'case-deadline|6805d1ab-18d0-43ec-bafb-654e83405416',
        sk: 'case-deadline|6805d1ab-18d0-43ec-bafb-654e83405416',
      },
    ]);
  });

  it('should attempt to do a batch get in the same ids that were returned in the mapping records', async () => {
    await getCaseDeadlinesByDocketNumber({
      applicationContext,
      docketNumber: mockCaseDeadline.docketNumber,
    });
    expect(client.batchGet.mock.calls[0][0].keys).toEqual([
      {
        pk: 'case-deadline|6805d1ab-18d0-43ec-bafb-654e83405416',
        sk: 'case-deadline|6805d1ab-18d0-43ec-bafb-654e83405416',
      },
    ]);
  });
});
