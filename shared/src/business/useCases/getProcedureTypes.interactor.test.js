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
    const applicationContext = {
      getCurrentUser: () => {
        return {
          userId: 'taxpayer',
          role: 'petitioner',
        };
      },
    };
    const procedureTypes = await getProcedureTypes({
      applicationContext,
    });
    expect(procedureTypes.length).toEqual(2);
    expect(procedureTypes[0]).toEqual('Regular');
    expect(procedureTypes[1]).toEqual('Small');
    let error;
    try {
      validateProcedureTypes(procedureTypes);
    } catch (e) {
      error = e;
    }
    expect(error).toBeUndefined();
  });

  it('throws a UnauthorizedError if user is unauthorized', async () => {
    const applicationContext = {
      getCurrentUser: () => {
        return {
          userId: 'nope',
        };
      },
    };
    let error;
    try {
      await getProcedureTypes({
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.message).toEqual('Unauthorized');
  });
});
