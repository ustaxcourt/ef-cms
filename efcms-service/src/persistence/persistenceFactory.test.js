const expect = require('chai').expect;

const chai = require('chai');
chai.use(require('chai-string'));

const { create } = require('./persistenceFactory');

describe('persistenceFactory - create', () => {
  it('should throw an error with an unexpected key', () => {
    let error;
    try {
      create('abc');
    } catch (err) {
      error = err;
    }
    expect(error).to.exist;
  })
})