const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  getCaseDeadlinesByDateRange,
} = require('./getCaseDeadlinesByDateRange');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('getCaseDeadlinesByDateRange', () => {
  const CASE_DEADLINE_ID = 'f75df546-c142-4b79-8746-e661327f7782';
  const DEADLINE_DATE = '2019-08-25T05:00:00.000Z';

  const mockDeadlineMappings = [
    {
      caseDeadlineId: CASE_DEADLINE_ID,
      pk: 'case-deadline-catalog',
      sk: DEADLINE_DATE,
    },
  ];
  const mockDeadlines = [
    {
      caseDeadlineId: CASE_DEADLINE_ID,
      deadlineDate: DEADLINE_DATE,
      docketNumber: MOCK_CASE.docketNumber,
      pk: `case-deadline|${CASE_DEADLINE_ID}`,
      sk: `case-deadline|${CASE_DEADLINE_ID}`,
    },
  ];

  beforeEach(() => {
    applicationContext.getDocumentClient().query.mockReturnValue({
      promise: () => Promise.resolve({ Items: mockDeadlineMappings }),
    });
    applicationContext.getDocumentClient().batchGet.mockReturnValue({
      promise: () =>
        Promise.resolve({ Responses: { 'efcms-local': mockDeadlines } }),
    });
  });

  it('should get case deadlines for the start and end date range', async () => {
    const START_DATE = '2019-08-25T05:00:00.000Z';
    const END_DATE = '2020-08-25T05:00:00.000Z';

    const results = await getCaseDeadlinesByDateRange({
      applicationContext,
      endDate: END_DATE,
      startDate: START_DATE,
    });
    expect(
      applicationContext.getDocumentClient().query.mock.calls[0][0],
    ).toMatchObject({
      ExpressionAttributeValues: {
        ':endDate': END_DATE,
        ':startDate': START_DATE,
      },
    });
    expect(results).toEqual(mockDeadlines);
  });
});
