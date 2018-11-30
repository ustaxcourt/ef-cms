const assert = require('assert');

const Case = require('./Case');

const A_VALID_CASE = {
  documents: [
    {
      documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      documentType: 'a',
      createdAt: '2018-11-21T20:49:28.192Z',
      userId: 'taxpayer',
      validated: true,
      reviewDate: '2018-11-21T20:49:28.192Z',
      reviewUser: 'petitionsclerk',
    },
    {
      documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      documentType: 'b',
      createdAt: '2018-11-21T20:49:28.192Z',
      userId: 'taxpayer',
      validated: true,
      reviewDate: '2018-11-21T20:49:28.192Z',
      reviewUser: 'petitionsclerk',
    },
    {
      documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      documentType: 'c',
      createdAt: '2018-11-21T20:49:28.192Z',
      userId: 'taxpayer',
      validated: true,
      reviewDate: '2018-11-21T20:49:28.192Z',
      reviewUser: 'petitionsclerk',
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

  describe('isValidCaseId', () => {
    it('returns true if a valid uuid', () => {
      assert.ok(Case.isValidCaseId('c54ba5a9-b37b-479d-9201-067ec6e335bb'));
    });

    it('returns false if a invalid uuid', () => {
      assert.equal(
        Case.isValidCaseId('XXX54ba5a9-b37b-479d-9201-067ec6e335bb'),
        false,
      );
    });
  });

  describe('isValidDocketNumber', () => {
    it('returns true if a valid docketNumber', () => {
      assert.ok(Case.isValidDocketNumber('00000-00'));
    });

    it('returns false if a invalid docketnumber', () => {
      assert.equal(Case.isValidDocketNumber('00'), false);
    });
  });

  describe('getRawValues', () => {
    it('returns a case without sendToIRS', () => {
      const caseRecord = new Case(A_VALID_CASE);
      caseRecord.sendToIRS = true;
      assert.equal(caseRecord.getRawValues().isSendToIRS, undefined);
    });
  });

  describe('isPetitionPackageReviewed', () => {
    it('return true is all documents are validated', () => {
      const caseRecord = new Case(A_VALID_CASE);
      assert.ok(caseRecord.isPetitionPackageReviewed());
    });
  });
});
