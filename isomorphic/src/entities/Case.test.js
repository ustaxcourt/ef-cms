const assert = require('assert');

const Case = require('./Case');

const A_VALID_CASE = {
  documents: [
    {
      documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      documentType: 'a',
    },
    {
      documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      documentType: 'b',
    },
    {
      documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      documentType: 'c',
    },
  ],
};

describe('Case entity', () => {
  describe('isValid', () => {
    it('Creates a valid case', () => {
      const myCase = new Case(A_VALID_CASE);
      assert.ok(myCase.isValid());
    });

    it('Creates an invalid case', () => {
      const myCase = new Case({
        documents: [
          {
            documentId: '123',
            documentType: 'testing',
          },
        ],
      });
      assert.ok(!myCase.isValid());
    });

    it('Creates an invalid case', () => {
      const myCase = new Case({
        documents: [],
      });
      assert.ok(!myCase.isValid());
    });

    it('Creates an invalid case', () => {
      const myCase = new Case({});
      assert.ok(!myCase.isValid());
    });
  });

  describe('validate', () => {
    it('should do nothing if valid', () => {
      let error = null;
      try {
        new Case(A_VALID_CASE).validate();
      } catch (err) {
        error = err;
      }
      assert.ok(error === null);
    });

    it('should throw an error on invalid cases', () => {
      let error = null;
      try {
        new Case({}).validate();
      } catch (err) {
        error = err;
      }
      assert.ok(error !== null);
    });
  });
});
