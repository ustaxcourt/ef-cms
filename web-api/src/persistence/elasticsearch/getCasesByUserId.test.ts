import { MAX_ELASTICSEARCH_PAGINATION } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getCasesByUserId } from './getCasesByUserId';

describe('getCasesByUserId', () => {
  const userId = 'user-id-123';

  it('obtains all cases associated with the given user', async () => {
    applicationContext.getSearchClient().search.mockReturnValue({
      body: {},
    });

    await getCasesByUserId({
      applicationContext,
      userId,
    });

    expect(
      applicationContext.getSearchClient().search.mock.calls[0][0].body.size,
    ).toEqual(10000);
    expect(
      applicationContext.getSearchClient().search.mock.calls[0][0].body.query,
    ).toMatchObject({
      bool: {
        should: [
          {
            term: {
              'privatePractitioners.L.M.userId.S': `${userId}`,
            },
          },
          {
            term: { 'irsPractitioners.L.M.userId.S': `${userId}` },
          },
          {
            term: { 'userId.S': `${userId}` },
          },
        ],
      },
    });
  });

  it('should warn if total search results exceeds MAX_ELASTICSEARCH_PAGINATION', async () => {
    applicationContext.getSearchClient().search.mockReturnValue({
      body: {
        hits: {
          total: {
            value: MAX_ELASTICSEARCH_PAGINATION + 1,
          },
        },
      },
    });

    await getCasesByUserId({
      applicationContext,
      userId,
    });

    expect(applicationContext.logger.warn).toHaveBeenCalled();
  });
});
