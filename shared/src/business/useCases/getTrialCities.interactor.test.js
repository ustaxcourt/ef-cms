const { getTrialCities } = require('./getTrialCities.interactor');
const joi = require('joi-browser');

const schema = joi.object().keys({
  state: joi.string().required(),
  city: joi.string().required(),
});

const validateTrialCities = trialCities => {
  trialCities.forEach(trialCity => {
    if (!joi.validate(trialCity, schema)) {
      throw new Error('invalid trial city');
    }
  });
};

describe('Get trial cities', () => {
  beforeEach(() => {});

  it('returns a collection of trial cities', async () => {
    const trialCities = await getTrialCities({
      userId: 'taxpayer',
      procedureType: 'Small',
    });
    expect(trialCities.length).toEqual(74);
    let error;
    try {
      validateTrialCities(trialCities);
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();
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
