const { getCaseTypes } = require('./getCaseTypes.interactor');
const joi = require('joi-browser');

describe('Get case types', () => {
  beforeEach(() => {});

  it('returns a collection of case types', async () => {
    const applicationContext = {
      getCurrentUser: () => {
        return {
          userId: 'taxpayer',
          role: 'petitioner',
        };
      },
    };
    const caseTypes = await getCaseTypes({
      applicationContext,
    });
    expect(caseTypes.length).toBeGreaterThan(0);
    expect(caseTypes[0]).not.toBeUndefined();
    expect(typeof caseTypes[0]).toEqual('string');
  });

  it('throws a UnauthorizedError if user is unauthorized', async () => {
    const applicationContext = {
      getCurrentUser: () => {
        return {
          userId: 'notarealboy',
        };
      },
    };
    let error;
    try {
      await getCaseTypes({
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.message).toEqual('Unauthorized');
  });
});
