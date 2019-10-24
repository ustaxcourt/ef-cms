const { getCaseTypesInteractor } = require('./getCaseTypesInteractor');
const { User } = require('../entities/User');

describe('Get case types', () => {
  beforeEach(() => {});

  it('returns a collection of case types', async () => {
    const applicationContext = {
      getCurrentUser: () => {
        return {
          role: User.ROLES.petitioner,
          userId: 'petitioner',
        };
      },
    };
    const caseTypes = await getCaseTypesInteractor({
      applicationContext,
    });
    expect(caseTypes.length).toBeGreaterThan(0);
    expect(caseTypes[0]).not.toBeUndefined();
    expect(typeof caseTypes[0]).toEqual('string');
  });
});
