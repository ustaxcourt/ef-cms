const expect = require('chai').expect;

const chai = require('chai');
chai.use(require('chai-string'));

const { save, getIndexName } = require('./awsDynamoPersistence');

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

  describe('getIndexName', () => {
    it ('should return null when pivot is not found', () => {
      let error;
      try {
        getIndexName('lol');
      } catch (err) {
        error = err;
      }
      expect(error).to.exist;
    })

    it ('should return null when pivot is not found', () => {
      let error;
      try {
        getIndexName('lol');
      } catch (err) {
        error = err;
      }
      expect(error).to.exist;
    })

    it ('should return null when pivot is null', () => {
      expect(getIndexName(null)).to.be.null
    })
  })
})