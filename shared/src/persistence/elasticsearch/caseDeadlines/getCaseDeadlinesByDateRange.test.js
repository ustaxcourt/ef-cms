const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  getCaseDeadlinesByDateRange,
} = require('./getCaseDeadlinesByDateRange');
jest.mock('../searchClient');
const {
  DEADLINE_REPORT_PAGE_SIZE,
} = require('../../../business/entities/EntityConstants');
const { search } = require('../searchClient');

describe('getCaseDeadlinesByDateRange', () => {
  const START_DATE = '2019-08-25T05:00:00.000Z';
  const END_DATE = '2020-08-25T05:00:00.000Z';

  it('returns results from the search client using default page size if one is not passed in', async () => {
    search.mockReturnValue({ results: ['some', 'matches'], total: 2 });

    const results = await getCaseDeadlinesByDateRange({
      applicationContext,
      endDate: END_DATE,
      startDate: START_DATE,
    });

    expect(search).toHaveBeenCalledTimes(1);
    expect(results).toMatchObject({
      foundDeadlines: ['some', 'matches'],
      totalCount: 2,
    });
    expect(search.mock.calls[0][0].searchParameters.body.size).toEqual(
      DEADLINE_REPORT_PAGE_SIZE,
    );
    expect(search.mock.calls[0][0].searchParameters.body.from).toEqual(0);
    expect(
      search.mock.calls[0][0].searchParameters.body.query.bool.filter[0].range[
        'deadlineDate.S'
      ].gte,
    ).toEqual(`${START_DATE}||/h`);
    expect(
      search.mock.calls[0][0].searchParameters.body.query.bool.filter[0].range[
        'deadlineDate.S'
      ].lte,
    ).toEqual(`${END_DATE}||/h`);
  });

  it('returns results from the search client using pageSize that is passed in if it is less than DEADLINE_REPORT_PAGE_SIZE', async () => {
    await getCaseDeadlinesByDateRange({
      applicationContext,
      endDate: END_DATE,
      from: 20,
      pageSize: DEADLINE_REPORT_PAGE_SIZE - 1,
      startDate: START_DATE,
    });

    expect(search.mock.calls[0][0].searchParameters.body.size).toEqual(
      DEADLINE_REPORT_PAGE_SIZE - 1,
    );
    expect(search.mock.calls[0][0].searchParameters.body.from).toEqual(20);
  });

  it('returns results from the search client using default DEADLINE_REPORT_PAGE_SIZE if pageSize is greater than DEADLINE_REPORT_PAGE_SIZE', async () => {
    await getCaseDeadlinesByDateRange({
      applicationContext,
      endDate: END_DATE,
      pageSize: DEADLINE_REPORT_PAGE_SIZE + 1,
      startDate: START_DATE,
    });

    expect(search.mock.calls[0][0].searchParameters.body.size).toEqual(
      DEADLINE_REPORT_PAGE_SIZE,
    );
  });

  it('adds judge query to search client call if judge is provided', async () => {
    await getCaseDeadlinesByDateRange({
      applicationContext,
      endDate: END_DATE,
      judge: 'Buch',
      pageSize: 1,
      startDate: START_DATE,
    });

    expect(
      search.mock.calls[0][0].searchParameters.body.query.bool.must[0],
    ).toEqual({
      simple_query_string: {
        default_operator: 'and',
        fields: ['associatedJudge.S'],
        query: '"Buch"',
      },
    });
  });
});
