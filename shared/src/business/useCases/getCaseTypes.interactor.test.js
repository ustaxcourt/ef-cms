const { getCaseTypes } = require('./getCaseTypes.interactor');

describe('Get case types', () => {
  beforeEach(() => {});

  it('returns a collection of case types', async () => {
    const caseTypes = await getCaseTypes({
      userId: 'taxpayer',
    });
    expect(caseTypes.length).toEqual(12);
    expect(caseTypes[0].type).not.toBeUndefined();
    expect(caseTypes[0].description).not.toBeUndefined();
    expect(typeof caseTypes[0].type).toEqual('string');
    expect(typeof caseTypes[0].description).toEqual('string');
    let error;
    try {
      JSON.parse(JSON.stringify(caseTypes[0]));
    } catch (e) {
      error = e;
    }
    expect(error).toBeUndefined();
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
