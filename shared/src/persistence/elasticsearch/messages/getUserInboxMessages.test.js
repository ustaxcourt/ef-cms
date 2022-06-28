const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { getUserInboxMessages } = require('./getUserInboxMessages');
jest.mock('../searchClient');
const { search } = require('../searchClient');

describe('getUserInboxMessages', () => {
  it('should return results from the search client', async () => {
    search.mockReturnValue({ results: ['some', 'matches'], total: 0 });

    const results = await getUserInboxMessages({
      applicationContext,
      userId: 'f5d68c53-af31-484d-803b-da22c4d03357',
    });

    expect(search).toHaveBeenCalledTimes(1);
    expect(results).toMatchObject(['some', 'matches']);
  });

  it('should filter out completed messages', async () => {
    search.mockReturnValue({ results: ['some', 'matches'], total: 0 });

    await getUserInboxMessages({
      applicationContext,
      userId: 'f5d68c53-af31-484d-803b-da22c4d03357',
    });

    expect(
      search.mock.calls[0][0].searchParameters.body.query.bool.must,
    ).toEqual(
      expect.arrayContaining([
        {
          term: {
            'isCompleted.BOOL': false,
          },
        },
      ]),
    );
  });
});
