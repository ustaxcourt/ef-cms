const assert = require('assert');

const Case = require('./Case');
const DocketRecord = require('./DocketRecord');
const { REGULAR_TRIAL_CITIES } = require('./TrialCities');
const { MOCK_CASE } = require('../../test/mockCase');

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

    it('creates a case with year amounts', () => {
      const myCase = new Case({
        petitioners: [],
        yearAmounts: [
          { year: '2000', amount: '34.50' },
          { year: '2001', amount: '34.50' },
        ],
      });
      assert.ok(!myCase.isValid());
    });

    it('should not be valid because of duplicate years in yearAmounts', () => {
      const isValid = new Case({
        ...MOCK_CASE,
        yearAmounts: [
          {
            year: '2000',
            amount: '34.50',
          },
          {
            year: '2000',
            amount: '34.50',
          },
        ],
      }).isValid();
      expect(isValid).toBeFalsy();
    });
  });

  describe('areYearsUnique', () => {
    it('will fail validation when having two year amounts with the same year', () => {
      const isValid = Case.areYearsUnique([
        {
          year: '2000',
          amount: '34.50',
        },
        {
          year: '2000',
          amount: '34.50',
        },
      ]);
      expect(isValid).toBeFalsy();
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

  describe('getCaseTitle', () => {
    it('party type Petitioner', () => {
      const caseTitle = Case.getCaseTitle(MOCK_CASE);
      expect(caseTitle).toEqual(
        'Test Taxpayer, Petitioner v. Commissioner of Internal Revenue, Respondent',
      );
    });

    it('party type Petitioner & Spouse', () => {
      const caseTitle = Case.getCaseTitle({
        ...MOCK_CASE,
        partyType: 'Petitioner & Spouse',
        contactSecondary: {
          name: 'Test Taxpayer 2',
        },
      });
      expect(caseTitle).toEqual(
        'Test Taxpayer & Test Taxpayer 2, Petitioners v. Commissioner of Internal Revenue, Respondent',
      );
    });

    it('party type Petitioner & Deceased Spouse', () => {
      const caseTitle = Case.getCaseTitle({
        ...MOCK_CASE,
        partyType: 'Petitioner & Deceased Spouse',
        contactSecondary: {
          name: 'Test Taxpayer 2',
        },
      });
      expect(caseTitle).toEqual(
        'Test Taxpayer & Test Taxpayer 2, Deceased, Test Taxpayer, Surviving Spouse, Petitioners v. Commissioner of Internal Revenue, Respondent',
      );
    });

    it('party type Estate with an Executor/Personal Representative/Fiduciary/etc.', () => {
      const caseTitle = Case.getCaseTitle({
        ...MOCK_CASE,
        partyType:
          'Estate with an Executor/Personal Representative/Fiduciary/etc.',
        contactSecondary: {
          name: 'Test Taxpayer 2',
        },
      });
      expect(caseTitle).toEqual(
        'Estate of Test Taxpayer 2, Deceased, Test Taxpayer, Executor, Petitioner(s) v. Commissioner of Internal Revenue, Respondent',
      );
    });

    it('party type Estate without an Executor/Personal Representative/Fiduciary/etc.', () => {
      const caseTitle = Case.getCaseTitle({
        ...MOCK_CASE,
        partyType:
          'Estate without an Executor/Personal Representative/Fiduciary/etc.',
      });
      expect(caseTitle).toEqual(
        'Estate of Test Taxpayer, Deceased, Petitioner v. Commissioner of Internal Revenue, Respondent',
      );
    });

    it('party type Trust', () => {
      const caseTitle = Case.getCaseTitle({
        ...MOCK_CASE,
        partyType: 'Trust',
        contactSecondary: {
          name: 'Test Taxpayer 2',
        },
      });
      expect(caseTitle).toEqual(
        'Test Taxpayer 2, Test Taxpayer, Trustee, Petitioner(s) v. Commissioner of Internal Revenue, Respondent',
      );
    });

    it('party type Corporation', () => {
      const caseTitle = Case.getCaseTitle({
        ...MOCK_CASE,
        partyType: 'Corporation',
      });
      expect(caseTitle).toEqual(
        'Test Taxpayer, Petitioner v. Commissioner of Internal Revenue, Respondent',
      );
    });

    it('party type Partnership Tax Matters', () => {
      const caseTitle = Case.getCaseTitle({
        ...MOCK_CASE,
        partyType: 'Partnership (as the tax matters partner)',
        contactSecondary: {
          name: 'Test Taxpayer 2',
        },
      });
      expect(caseTitle).toEqual(
        'Test Taxpayer 2, Test Taxpayer, Tax Matters Partner, Petitioner v. Commissioner of Internal Revenue, Respondent',
      );
    });

    it('party type Partnership Other Than Tax Matters', () => {
      const caseTitle = Case.getCaseTitle({
        ...MOCK_CASE,
        partyType: 'Partnership (as a partner other than tax matters partner)',
        contactSecondary: {
          name: 'Test Taxpayer 2',
        },
      });
      expect(caseTitle).toEqual(
        'Test Taxpayer 2, Test Taxpayer, A Partner Other Than the Tax Matters Partner, Petitioner v. Commissioner of Internal Revenue, Respondent',
      );
    });

    it('party type Partnership BBA', () => {
      const caseTitle = Case.getCaseTitle({
        ...MOCK_CASE,
        partyType:
          'Partnership (as a partnership representative under the BBA regime)',
        contactSecondary: {
          name: 'Test Taxpayer 2',
        },
      });
      expect(caseTitle).toEqual(
        'Test Taxpayer 2, Test Taxpayer, Partnership Representative, Petitioner(s) v. Commissioner of Internal Revenue, Respondent',
      );
    });

    it('party type Conservator', () => {
      const caseTitle = Case.getCaseTitle({
        ...MOCK_CASE,
        partyType: 'Conservator',
        contactSecondary: {
          name: 'Test Taxpayer 2',
        },
      });
      expect(caseTitle).toEqual(
        'Test Taxpayer 2, Test Taxpayer, Conservator, Petitioner v. Commissioner of Internal Revenue, Respondent',
      );
    });

    it('party type Guardian', () => {
      const caseTitle = Case.getCaseTitle({
        ...MOCK_CASE,
        partyType: 'Guardian',
        contactSecondary: {
          name: 'Test Taxpayer 2',
        },
      });
      expect(caseTitle).toEqual(
        'Test Taxpayer 2, Test Taxpayer, Guardian, Petitioner v. Commissioner of Internal Revenue, Respondent',
      );
    });

    it('party type Custodian', () => {
      const caseTitle = Case.getCaseTitle({
        ...MOCK_CASE,
        partyType: 'Custodian',
        contactSecondary: {
          name: 'Test Taxpayer 2',
        },
      });
      expect(caseTitle).toEqual(
        'Test Taxpayer 2, Test Taxpayer, Custodian, Petitioner v. Commissioner of Internal Revenue, Respondent',
      );
    });

    it('party type Minor', () => {
      const caseTitle = Case.getCaseTitle({
        ...MOCK_CASE,
        partyType:
          'Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)',
        contactSecondary: {
          name: 'Test Taxpayer 2',
        },
      });
      expect(caseTitle).toEqual(
        'Test Taxpayer 2, Minor, Test Taxpayer, Next Friend, Petitioner v. Commissioner of Internal Revenue, Respondent',
      );
    });

    it('party type Incompetent Person', () => {
      const caseTitle = Case.getCaseTitle({
        ...MOCK_CASE,
        partyType:
          'Next Friend for an Incompetent Person (Without a Guardian, Conservator, or other like Fiduciary)',
        contactSecondary: {
          name: 'Test Taxpayer 2',
        },
      });
      expect(caseTitle).toEqual(
        'Test Taxpayer 2, Incompetent, Test Taxpayer, Next Friend, Petitioner v. Commissioner of Internal Revenue, Respondent',
      );
    });

    it('party type Donor', () => {
      const caseTitle = Case.getCaseTitle({
        ...MOCK_CASE,
        partyType: 'Donor',
        contactSecondary: {
          name: 'Test Taxpayer 2',
        },
      });
      expect(caseTitle).toEqual(
        'Test Taxpayer, Donor, Petitioner v. Commissioner of Internal Revenue, Respondent',
      );
    });

    it('party type Transferee', () => {
      const caseTitle = Case.getCaseTitle({
        ...MOCK_CASE,
        partyType: 'Transferee',
        contactSecondary: {
          name: 'Test Taxpayer 2',
        },
      });
      expect(caseTitle).toEqual(
        'Test Taxpayer, Transferee, Petitioner v. Commissioner of Internal Revenue, Respondent',
      );
    });

    it('party type Surviving Spouse', () => {
      const caseTitle = Case.getCaseTitle({
        ...MOCK_CASE,
        partyType: 'Surviving Spouse',
        contactSecondary: {
          name: 'Test Taxpayer 2',
        },
      });
      expect(caseTitle).toEqual(
        'Test Taxpayer 2, Deceased, Test Taxpayer, Surviving Spouse, Petitioner v. Commissioner of Internal Revenue, Respondent',
      );
    });
  });

  describe('sendToIRSHoldingQueue', () => {
    it('sets status for irs batch', () => {
      const caseRecord = new Case(MOCK_CASE);
      caseRecord.sendToIRSHoldingQueue();
      expect(caseRecord.status).toEqual('Batched for IRS');
    });
  });

  describe('markAsPaidByPayGov', () => {
    it('sets pay gov fields', () => {
      const caseRecord = new Case(MOCK_CASE);
      caseRecord.markAsPaidByPayGov(new Date().toISOString());
      assert.ok(caseRecord.payGovDate);
    });
  });

  describe('addDocketRecord', () => {
    it('adds a new docketrecord', () => {
      const caseRecord = new Case(MOCK_CASE);
      caseRecord.addDocketRecord(
        new DocketRecord({
          filingDate: new Date().toISOString(),
          description: 'test',
        }),
      );
      expect(caseRecord.docketRecord).toHaveLength(1);
      expect(caseRecord.docketRecord[0].description).toEqual('test');
    });
    it('validates the docketrecord', () => {
      const caseRecord = new Case(MOCK_CASE);
      caseRecord.addDocketRecord(new DocketRecord({ description: 'test' }));
      let error;
      try {
        caseRecord.validate();
      } catch (err) {
        error = err;
      }
      expect(error).toBeTruthy();
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

  describe('getFilingTypes', () => {
    it('returns the filing types', () => {
      const filingTypes = Case.getFilingTypes();
      expect(filingTypes).not.toBeNull();
      expect(filingTypes.length).toEqual(4);
      expect(filingTypes[0]).toEqual('Myself');
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
    it('returns the regular trial cities for unidentified procedure type', () => {
      const procedureType = 'unknown';
      const trialCities = Case.getTrialCities(procedureType);
      expect(trialCities).toEqual(REGULAR_TRIAL_CITIES);
    });
  });
});
