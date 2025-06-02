import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { elasticSearchHealthCheck } from '@web-api/persistence/elasticsearch/elasticSearchHealthCheck';

describe('elasticSearchHealthCheck', () => {
  it('should return results from elastic search', async () => {
    applicationContext.getSearchClient().search.mockReturnValue({
      body: {},
    });

    await elasticSearchHealthCheck({
      applicationContext,
    });

    expect(
      applicationContext.getSearchClient().search.mock.calls[0][0].body.query,
    ).toEqual({ match_all: {} });
  });
});
