const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { getCasesByDocketNumbers } = require('./getCasesByDocketNumbers');

describe('getCasesByDocketNumbers', () => {
  it('should call query once for each docket number passed in', async () => {
    await getCasesByDocketNumbers({
      applicationContext,
      docketNumbers: ['123-20', '124-20', '2000-20'],
    });

    expect(applicationContext.getDocumentClient().query.mock.calls.length).toBe(
      3,
    );
  });
});
