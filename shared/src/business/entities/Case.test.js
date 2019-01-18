const assert = require('assert');

const Case = require('./Case');
const { MOCK_CASE } = require('../../test/mockCase');

const DATE = '2018-12-17T15:33:23.492Z';
const sinon = require('sinon');

describe('Case entity', () => {
  describe('isValid', () => {
    it('Creates a valid case', () => {
      const myCase = new Case(MOCK_CASE);
      assert.ok(myCase.isValid());
    });

    it('Creates a valid case from an already existing case json', () => {
      const myCase = new Case(MOCK_CASE);
      assert.ok(myCase.isValid());
    });

    it('adds a paygov date to an already existing case json', () => {
      const myCase = new Case({ payGovId: '1234', ...MOCK_CASE });
      assert.ok(myCase.isValid());
      assert.ok(myCase.payGovDate);
    });

    it('Creates an invalid case with a document', () => {
      const myCase = new Case({
        petitioners: [{ name: 'Test Taxpayer' }],
        documents: [
          {
            documentId: '123',
            documentType: 'testing',
          },
        ],
      });
      assert.ok(!myCase.isValid());
    });

    it('Creates an invalid case with no documents', () => {
      const myCase = new Case({
        documents: [],
      });
      assert.ok(!myCase.isValid());
    });

    it('Creates an invalid case with empty object', () => {
      const myCase = new Case({});
      assert.ok(!myCase.isValid());
    });

    it('Creates an invalid case with no petitioners', () => {
      const myCase = new Case({
        petitioners: [],
      });
      assert.ok(!myCase.isValid());
    });
  });

  describe('validate', () => {
    it('should do nothing if valid', () => {
      let error = null;
      try {
        new Case(MOCK_CASE).validate();
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
      assert.ok(Case.isValidDocketNumber('00101-00'));
    });

    it('returns false if a invalid docketnumber', () => {
      assert.equal(Case.isValidDocketNumber('00'), false);
    });
  });

  describe('markAsSentToIRS', () => {
    it('sets irsSendDate', () => {
      const caseRecord = new Case(MOCK_CASE);
      caseRecord.markAsSentToIRS('2018-12-04T18:27:13.370Z');
      assert.ok(caseRecord.irsSendDate);
    });
  });

  describe('markAsPaidByPayGov', () => {
    it('sets pay gov fields', () => {
      const caseRecord = new Case(MOCK_CASE);
      caseRecord.markAsPaidByPayGov(new Date().toISOString());
      assert.ok(caseRecord.payGovDate);
    });
  });

  describe('validateWithError', () => {
    it('passes back an error passed in if invalid', () => {
      let error = null;
      const caseRecord = new Case({});
      try {
        caseRecord.validateWithError(new Error('Imarealerror'));
      } catch (e) {
        error = e;
      }
      assert.ok(error);
      expect(error.message).toContain('Imarealerror');
    });

    it('doesnt passes back an error passed in if valid', () => {
      let error = null;
      const caseRecord = new Case(MOCK_CASE);
      try {
        caseRecord.validateWithError(new Error('Imarealerror'));
      } catch (e) {
        error = e;
      }
      assert.ok(!error);
    });
  });

  describe('attachDocument', () => {
    beforeEach(() => {
      sinon.stub(window.Date.prototype, 'toISOString').returns(DATE);
    });

    afterEach(() => {
      window.Date.prototype.toISOString.restore();
    });

    it('should attach the document to the case', () => {
      const caseToVerify = new Case({});
      caseToVerify.attachDocument({
        documentType: 'Answer',
        documentId: '123',
        userId: 'respondent',
      });
      expect(caseToVerify.documents.length).toEqual(1);
      expect(caseToVerify.documents[0]).toEqual({
        documentType: 'Answer',
        documentId: '123',
        userId: 'respondent',
        filedBy: 'Respondent',
        createdAt: DATE,
        workItems: [],
      });
    });
  });

  describe('getCaseTypes', () => {
    it('returns the case types', () => {
      const caseTypes = Case.getCaseTypes();
      expect(caseTypes).not.toBeNull();
      expect(caseTypes.length).toBeGreaterThan(1);
    });
  });

  describe('attachRespondent', () => {
    it('adds the user to the respondents', () => {
      const caseToVerify = new Case({});
      caseToVerify.attachRespondent({
        user: {
          userId: 'respondent',
        },
      });
      expect(caseToVerify.respondent).not.toBeNull();
      expect(caseToVerify.respondent.userId).toEqual('respondent');
    });
  });

  describe('addDocument', () => {
    it('attaches the document to the case', () => {
      const caseToVerify = new Case({});
      caseToVerify.addDocument({
        documentType: 'Answer',
        documentId: '123',
        userId: 'respondent',
      });
      expect(caseToVerify.documents.length).toEqual(1);
      expect(caseToVerify.documents[0]).toMatchObject({
        documentType: 'Answer',
        documentId: '123',
        userId: 'respondent',
      });
    });
  });

  describe('getProcedureTypes', () => {
    it('returns the procedure types', () => {
      const procedureTypes = Case.getProcedureTypes();
      expect(procedureTypes).not.toBeNull();
      expect(procedureTypes.length).toEqual(2);
      expect(procedureTypes[0]).toEqual('Regular');
      expect(procedureTypes[1]).toEqual('Small');
    });
  });

  describe('getTrialCities', () => {
    it('returns the trial cities by procedure type', () => {
      const procedureTypes = Case.getProcedureTypes();
      procedureTypes.forEach(procedureType => {
        const trialCities = Case.getTrialCities(procedureType);
        expect(trialCities).not.toBeNull();
        expect(trialCities.length).toBeGreaterThan(1);
      });
    });
  });
});
