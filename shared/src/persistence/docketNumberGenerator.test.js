const chai = require('chai');
const expect = require('chai').expect;
chai.use(require('chai-string'));

const { createDocketNumber } = require('./docketNumberGenerator');

describe('Create docket number', function() {
  it('should create a docketNumber', async () => {
    const result = await createDocketNumber({
      getPersistenceGateway: () => {
        return {
          incrementCounter: () => Promise.resolve(123),
        };
      },
      environment: {
        stage: 'local',
      },
    });
    const last2YearDigits = new Date()
      .getFullYear()
      .toString()
      .substr(-2);
    expect(result).to.equal(`00223-${last2YearDigits}`);
  });
});
