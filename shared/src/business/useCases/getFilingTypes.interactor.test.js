const { getFilingTypes } = require('./getFilingTypes.interactor');
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
    const filingTypes = await getFilingTypes({
      userId: 'taxpayer',
    });
    expect(filingTypes.length).toEqual(1);
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
    let error;
    try {
      await getFilingTypes({
        userId: 'notataxpayer',
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.message).toEqual('Unauthorized');
  });
});
