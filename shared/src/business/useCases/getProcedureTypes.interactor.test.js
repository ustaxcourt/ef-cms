const { getProcedureTypes } = require('./getProcedureTypes.interactor');

describe('Get case procedure types', () => {
  beforeEach(() => {});

  it('returns a collection of procedure types', async () => {
    const procedureTypes = await getProcedureTypes({
      userId: 'taxpayer',
    });
    expect(procedureTypes.length).toEqual(2);
    expect(procedureTypes[0]).toEqual('Small');
    expect(procedureTypes[1]).toEqual('Regular');
  });

  it('throws a UnauthorizedError if user is unauthorized', async () => {
    let error;
    try {
      await getProcedureTypes({
        userId: 'notataxpayer',
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.message).toEqual('Unauthorized');
  });
});
