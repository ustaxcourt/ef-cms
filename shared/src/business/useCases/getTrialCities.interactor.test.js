const { getTrialCities } = require('./getTrialCities.interactor');

describe('Get trial cities', () => {
  beforeEach(() => {});

  it('returns a collection of trial cities', async () => {
    const caseTypes = await getTrialCities({
      userId: 'taxpayer',
      procedureType: 'Small',
    });
    expect(caseTypes.length).toEqual(74);
  });

  it('throws a UnauthorizedError if user is unauthorized', async () => {
    let error;
    try {
      await getTrialCities({
        userId: 'notataxpayer',
        procedureType: 'Small',
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.message).toEqual('Unauthorized');
  });
});
