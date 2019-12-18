const DateHandler = require('../../../business/utilities/DateHandler');
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
        getUtilities: () => {
          return { ...DateHandler, formatNow: () => '96' };
        },
      },
    });
    expect(result).toEqual('223-96');
  });
});
