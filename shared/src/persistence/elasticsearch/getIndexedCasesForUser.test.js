const {
  applicationContext,
} = require('../../business/test/createTestApplicationContext');
const {
  CASE_STATUS_TYPES,
} = require('../../business/entities/EntityConstants');
const { getIndexedCasesForUser } = require('./getIndexedCasesForUser');

describe('getIndexedCasesForUser', () => {
  beforeEach(() => {});

  it('should search for cases by the userId and statuses provided', async () => {
    const mockUserId = '123';

    await getIndexedCasesForUser({
      applicationContext,
      statuses: [
        CASE_STATUS_TYPES.new,
        CASE_STATUS_TYPES.jurisdictionRetained,
        CASE_STATUS_TYPES.calendared,
      ],
      userId: mockUserId,
    });

    expect(
      applicationContext.getSearchClient().search.mock.calls[0][0].body.query
        .bool.must,
    ).toMatchObject([
      {
        term: {
          'pk.S': `user|${mockUserId}`,
        },
      },
      {
        terms: {
          'status.S': [
            CASE_STATUS_TYPES.new,
            CASE_STATUS_TYPES.jurisdictionRetained,
            CASE_STATUS_TYPES.calendared,
          ],
        },
      },
    ]);
    expect(
      applicationContext.getSearchClient().search.mock.calls[0][0].body.sort,
    ).toBeUndefined();
  });

  it('should search for closed cases', async () => {
    const mockUserId = '123';

    await getIndexedCasesForUser({
      applicationContext,
      statuses: [CASE_STATUS_TYPES.closed],
      userId: mockUserId,
    });

    expect(
      applicationContext.getSearchClient().search.mock.calls[0][0].body.query
        .bool.must,
    ).toMatchObject([
      {
        term: {
          'pk.S': `user|${mockUserId}`,
        },
      },
      {
        terms: {
          'status.S': [CASE_STATUS_TYPES.closed],
        },
      },
    ]);
    expect(
      applicationContext.getSearchClient().search.mock.calls[0][0].body.sort,
    ).toEqual([{ 'closedDate.S': { order: 'desc' } }]);
  });
});
