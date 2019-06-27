const { Case } = require('../entities/cases/Case');
const { getProcedureTypes } = require('./getProcedureTypesInteractor');

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
          role: 'petitioner',
          userId: 'taxpayer',
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
});
