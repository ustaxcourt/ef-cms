const { get, entityPersistenceLookup } = require('./environment');
const expect = require('chai').expect;
const chai = require('chai');
chai.use(require('chai-string'));

describe('environment', () => {
  describe('stage not set', () => {
    beforeEach(() => {
      delete process.env.STAGE;
    });

    it('get DOCUMENTS_TABLE', () => {
      const value = get('DOCUMENTS_TABLE')
      expect(value).to.equal('efcms-documents-local');
    })
  });

  describe('stage set', () => {
    beforeEach(() => {
      process.env.STAGE = 'dev'
    });

    it('get DOCUMENTS_TABLE', () => {
      const value = get('DOCUMENTS_TABLE')
      expect(value).to.equal('efcms-documents-dev');
    });
  });

  describe('entityPersistenceLookup', () => {
    it('should throw an error with an unexpected key', () => {
      let error;
      try {
        entityPersistenceLookup('lol');
      } catch (err) {
        error = err;
      }
      expect(error).to.exist;
    });
  });
});
