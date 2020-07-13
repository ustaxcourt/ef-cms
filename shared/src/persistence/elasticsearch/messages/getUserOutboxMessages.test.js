const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { getUserOutboxMessages } = require('./getUserOutboxMessages');
jest.mock('../searchClient');
const { search } = require('../searchClient');

describe('getUserOutboxMessages', () => {
  it('returns results from the search client', async () => {
    search.mockReturnValue({ results: ['some', 'matches'], total: 0 });

    const results = await getUserOutboxMessages({
      applicationContext,
      userId: '318de3b3-1625-4638-98a3-c67ab1b17be7',
    });

    expect(search).toHaveBeenCalledTimes(1);
    expect(results).toMatchObject(['some', 'matches']);
  });
});
