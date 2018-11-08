const sinon = require('sinon');
const proxyquire =  require('proxyquire').noCallThru();

const expect = require('chai').expect;
const chai = require('chai');
chai.use(require('chai-string'));

describe('Create docket number', function() {

  const stub = sinon.stub();
  let docketNumberGenerator;

  before(function() {
    stub.resolves(123);

    docketNumberGenerator = proxyquire('./docketNumberGenerator', {
      '../../middleware/dynamodbClientService' : {
        updateConsistent: stub
      }
    });
  });

  it('should create a docketNumber', async () => {
    const result = await docketNumberGenerator.createDocketNumber();
    const last2YearDigits = new Date().getFullYear().toString().substr(-2);
    expect(result).to.equal(`00223-${last2YearDigits}`);
  });
});
