const expect = require('chai').expect;

const chai = require('chai');
chai.use(require('chai-string'));

const { save } = require('./awsDynamoPersistence');

describe('awsDynamoPersistence', () => {
  it('should throw an error with an unexpected key', () => {
    let error;
    try {
      save('abc');
    } catch (err) {
      error = err;
    }
    expect(error).to.exist;
  })
})