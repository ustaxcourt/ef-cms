const DateHandler = require('../../../business/utilities/DateHandler');
const { createBarNumber } = require('./barNumberGenerator');

describe('Create bar number', function () {
  it('should create a bar number', async () => {
    const result = await createBarNumber({
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
          return { ...DateHandler, formatNow: () => '20' };
        },
      },
      initials: 'EJ',
    });
    expect(result).toEqual('EJ20123');
  });

  it('should pad numbers to three places', async () => {
    const result = await createBarNumber({
      applicationContext: {
        environment: {
          stage: 'local',
        },
        getPersistenceGateway: () => {
          return {
            incrementCounter: () => Promise.resolve(9),
          };
        },
        getUtilities: () => {
          return { ...DateHandler, formatNow: () => '21' };
        },
      },
      initials: 'EJ',
    });
    expect(result).toEqual('EJ21009');
  });
});
