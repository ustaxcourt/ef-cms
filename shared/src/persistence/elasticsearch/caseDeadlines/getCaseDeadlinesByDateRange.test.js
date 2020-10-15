const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  getCaseDeadlinesByDateRange,
} = require('./getCaseDeadlinesByDateRange');
jest.mock('../searchClient');
const {
  PETITIONS_SECTION,
} = require('../../../business/entities/EntityConstants');
const { search } = require('../searchClient');

describe('getCaseDeadlinesByDateRange', () => {
  it('returns results from the search client', async () => {
    search.mockReturnValue({ results: ['some', 'matches'], total: 2 });

    const results = await getCaseDeadlinesByDateRange({
      applicationContext,
      section: PETITIONS_SECTION,
    });

    expect(search).toHaveBeenCalledTimes(1);
    expect(results).toMatchObject({
      foundDeadlines: ['some', 'matches'],
      totalCount: 2,
    });
  });
});
