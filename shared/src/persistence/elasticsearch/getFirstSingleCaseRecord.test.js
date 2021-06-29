const {
  applicationContext,
} = require('../../business/test/createTestApplicationContext');
const { getFirstSingleCaseRecord } = require('./getFirstSingleCaseRecord');

describe('getFirstSingleCaseRecord', () => {
  beforeEach(() => {});

  it('should search for the first single case record', async () => {
    await getFirstSingleCaseRecord({
      applicationContext,
    });

    expect(
      applicationContext.getSearchClient().search.mock.calls[0][0].body.query,
    ).toEqual({ match_all: {} });
  });
});
