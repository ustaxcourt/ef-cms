import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getCaseDeadlinesByDateRange } from './getCaseDeadlinesByDateRange';
jest.mock('../searchClient');
import { search } from '../searchClient';

describe('getCaseDeadlinesByDateRange', () => {
  const START_DATE = '2019-08-25T05:00:00.000Z';
  const END_DATE = '2020-08-25T05:00:00.000Z';

  it('returns results from the search client', async () => {
    (search as jest.Mock).mockReturnValue({
      results: ['some', 'matches'],
      total: 2,
    });

    const results = await getCaseDeadlinesByDateRange({
      applicationContext,
      endDate: END_DATE,
      startDate: START_DATE,
    });

    expect(search).toHaveBeenCalledTimes(1);
    expect(results).toMatchObject({ foundDeadlines: ['some', 'matches'] });

    const callParam = (search as jest.Mock).mock.calls[0][0];
    expect(
      callParam.searchParameters.body.query.bool.filter[0].range[
        'deadlineDate.S'
      ].gte,
    ).toEqual(`${START_DATE}||/h`);
    expect(
      callParam.searchParameters.body.query.bool.filter[0].range[
        'deadlineDate.S'
      ].lte,
    ).toEqual(`${END_DATE}||/h`);
  });

  it('adds judge query to search client call if judge is provided', async () => {
    await getCaseDeadlinesByDateRange({
      applicationContext,
      endDate: END_DATE,
      judge: 'Buch',
      startDate: START_DATE,
    });

    const callParam = (search as jest.Mock).mock.calls[0][0];
    expect(callParam.searchParameters.body.query.bool.must[0]).toEqual({
      simple_query_string: {
        default_operator: 'and',
        fields: ['associatedJudge.S'],
        query: '"Buch"',
      },
    });
  });
});
