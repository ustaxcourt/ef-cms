const { getFilingTypes } = require('./getFilingTypesInteractor');
const Case = require('../entities/Case');

const validateFilingTypes = filingTypes => {
  filingTypes.forEach(filingType => {
    if (!Case.getFilingTypes().includes(filingType)) {
      throw new Error('invalid filing type');
    }
  });
};

describe('Get case filing types', () => {
  beforeEach(() => {});

  it('returns a collection of filing types', async () => {
    const applicationContext = {
      getCurrentUser: () => {
        return {
          role: 'petitioner',
          userId: 'taxpayer',
        };
      },
    };
    const filingTypes = await getFilingTypes({
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
      await getFilingTypes({
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.message).toEqual('Unauthorized');
  });
});
