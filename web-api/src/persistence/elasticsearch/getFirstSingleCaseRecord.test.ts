import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getFirstSingleCaseRecord } from './getFirstSingleCaseRecord';

describe('getFirstSingleCaseRecord', () => {
  it('should search for the first single case record', async () => {
    applicationContext.getSearchClient().search.mockReturnValue({
      body: {},
    });

    await getFirstSingleCaseRecord({
      applicationContext,
    });

    expect(
      applicationContext.getSearchClient().search.mock.calls[0][0].body.query,
    ).toEqual({ match_all: {} });
  });
});
