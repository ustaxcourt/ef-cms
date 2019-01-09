const { getProcedureTypes } = require('./getProcedureTypes.interactor');
const Case = require('../entities/Case');

const validateProcedureTypes = procedureTypes => {
  procedureTypes.forEach(procedureType => {
    if (!Case.getProcedureTypes().includes(procedureType)) {
      throw new Error('invalid procedure type');
    }
  });
};
describe('Get case procedure types', () => {
  beforeEach(() => {});

  it('returns a collection of procedure types', async () => {
    const procedureTypes = await getProcedureTypes({
      userId: 'taxpayer',
    });
    expect(procedureTypes.length).toEqual(2);
    expect(procedureTypes[0]).toEqual('Small');
    expect(procedureTypes[1]).toEqual('Regular');
    let error;
    try {
      validateProcedureTypes(procedureTypes);
    } catch (e) {
      error = e;
    }
    expect(error).toBeUndefined();
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
