const { getCaseTypes } = require('./getCaseTypes.interactor');

describe('Get case types', () => {
  beforeEach(() => {});

  it('returns a collection of case types', async () => {
    const caseTypes = await getCaseTypes({
      userId: 'taxpayer',
    });
    expect(caseTypes.length).toEqual(12);
  });

  it('throws a UnauthorizedError if user is unauthorized', async () => {
    let error;
    try {
      await getCaseTypes({
        userId: 'notataxpayer',
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.message).toEqual('Unauthorized');
  });
});
