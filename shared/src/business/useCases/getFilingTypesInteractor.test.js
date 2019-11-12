const { Case } = require('../entities/cases/Case');
const { getFilingTypesInteractor } = require('./getFilingTypesInteractor');
const { User } = require('../entities/User');

const validateFilingTypes = filingTypes => {
  filingTypes.forEach(filingType => {
    if (
      !Case.getFilingTypes('petitioner').includes(filingType) &&
      !Case.getFilingTypes('practitioner').includes(filingType)
    ) {
      throw new Error('invalid filing type');
    }
  });
};

describe('Get case filing types', () => {
  beforeEach(() => {});

  it('returns a collection of filing types for user role petitioner', async () => {
    const applicationContext = {
      getCurrentUser: () => {
        return {
          role: User.ROLES.petitioner,
          userId: 'petitioner',
        };
      },
    };
    const filingTypes = await getFilingTypesInteractor({
      applicationContext,
    });
    expect(filingTypes.length).toEqual(4);
    expect(filingTypes[0]).toEqual('Myself');
    let error;
    try {
      validateFilingTypes(filingTypes);
    } catch (e) {
      error = e;
    }
    expect(error).toBeUndefined();
  });

  it('returns a collection of filing types for user role practitioner', async () => {
    const applicationContext = {
      getCurrentUser: () => {
        return {
          role: User.ROLES.practitioner,
          userId: 'someLawyer',
        };
      },
    };
    const filingTypes = await getFilingTypesInteractor({
      applicationContext,
    });
    expect(filingTypes.length).toEqual(4);
    expect(filingTypes[0]).toEqual('Individual petitioner');
    let error;
    try {
      validateFilingTypes(filingTypes);
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
      await getFilingTypesInteractor({
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.message).toEqual('Unauthorized');
  });
});
