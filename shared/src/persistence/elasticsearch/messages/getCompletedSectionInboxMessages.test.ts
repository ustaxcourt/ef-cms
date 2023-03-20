const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  getCompletedSectionInboxMessages,
} = require('./getCompletedSectionInboxMessages');
jest.mock('../searchClient');
const {
  PETITIONS_SECTION,
} = require('../../../business/entities/EntityConstants');
const { search } = require('../searchClient');

describe('getCompletedSectionInboxMessages', () => {
  it('should return results from the search client', async () => {
    search.mockReturnValue({ results: ['some', 'matches'], total: 0 });

    const results = await getCompletedSectionInboxMessages({
      applicationContext,
      section: PETITIONS_SECTION,
    });

    expect(search).toHaveBeenCalledTimes(1);
    expect(results).toMatchObject(['some', 'matches']);
  });
});
