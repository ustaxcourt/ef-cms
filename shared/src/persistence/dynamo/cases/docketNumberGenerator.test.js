const { createDocketNumber } = require('./docketNumberGenerator');

describe('Create docket number', function() {
  it('should create a docketNumber', async () => {
    const result = await createDocketNumber({
      applicationContext: {
        environment: {
          stage: 'local',
        },
        getPersistenceGateway: () => {
          return {
            incrementCounter: () => Promise.resolve(123),
          };
        },
      },
    });
    const last2YearDigits = new Date()
      .getFullYear()
      .toString()
      .substr(-2);
    expect(result).toEqual(`223-${last2YearDigits}`);
  });
});
