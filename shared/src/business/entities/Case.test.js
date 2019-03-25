const assert = require('assert');

const { Case } = require('./Case');
const { DocketRecord } = require('./DocketRecord');
const { MOCK_CASE, MOCK_CASE_WITHOUT_NOTICE } = require('../../test/mockCase');
const { PARTY_TYPES } = require('./contacts/PetitionContact');

describe('Case entity', () => {
  it('defaults the orders to false', () => {
    const myCase = new Case(MOCK_CASE);
    expect(myCase).toMatchObject({
      noticeOfAttachments: false,
      orderForAmendedPetition: false,
      orderForAmendedPetitionAndFilingFee: false,
      orderForFilingFee: false,
      orderForOds: false,
      orderForRatification: false,
      orderToShowCause: false,
    });
  });

  it('sets the expected order booleans', () => {
    const myCase = new Case({
      ...MOCK_CASE,
      noticeOfAttachments: true,
      orderForAmendedPetition: false,
      orderForAmendedPetitionAndFilingFee: false,
      orderForFilingFee: true,
      orderForOds: false,
      orderForRatification: false,
      orderToShowCause: true,
    });
    expect(myCase).toMatchObject({
      noticeOfAttachments: true,
      orderForAmendedPetition: false,
      orderForAmendedPetitionAndFilingFee: false,
      orderForFilingFee: true,
      orderForOds: false,
      orderForRatification: false,
      orderToShowCause: true,
    });
  });

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
        documents: [
          {
            documentId: '123',
            documentType: 'testing',
          },
        ],
        petitioners: [{ name: 'Test Taxpayer' }],
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
          { amount: '34.50', year: '2000' },
          { amount: '34.50', year: '2001' },
        ],
      });
      assert.ok(!myCase.isValid());
    });

    it('should not be valid because of duplicate years in yearAmounts', () => {
      const isValid = new Case({
        ...MOCK_CASE,
        yearAmounts: [
          {
            amount: '34.50',
            year: '2000',
          },
          {
            amount: '100.50',
            year: '2000',
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
          amount: '34.50',
          year: '2000',
        },
        {
          amount: '34.50',
          year: '2000',
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

    describe('should pass when hasIrsNotice is provided', () => {
      it('and hasIrsNotice is true and all required fields are provided', () => {
        let error = null;
        try {
          new Case(MOCK_CASE).validate();
        } catch (err) {
          error = err;
        }
        assert.ok(error === null);
      });

      it('and hasIrsNotice is false and is missing irsNoticeDate', () => {
        let error = null;
        let rawCase = Object.assign(
          { caseType: 'Other', hasIrsNotice: false },
          MOCK_CASE_WITHOUT_NOTICE,
        );
        try {
          new Case(rawCase).validate();
        } catch (err) {
          error = err;
        }
        assert.ok(error === null);
      });
    });

    describe('should fail when hasIRSnotice is true', () => {
      it('and is missing irsNoticeDate', () => {
        let error = null;
        let rawCase = Object.assign(
          { caseType: 'Other', hasIrsNotice: true },
          MOCK_CASE_WITHOUT_NOTICE,
        );
        try {
          new Case(rawCase).validate();
        } catch (err) {
          error = err;
        }
        expect(error).toBeDefined();
      });

      it('and is missing hasIrsNotice', () => {
        let error = null;
        let rawCase = Object.assign(
          { caseType: 'Other', irsNoticeDate: '2018-03-01T00:00:00.000Z' },
          MOCK_CASE_WITHOUT_NOTICE,
        );
        try {
          new Case(rawCase).validate();
        } catch (err) {
          error = err;
        }
        expect(error).toBeDefined();
      });
    });

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
    it('updates docket record status on petition documents', () => {
      const caseRecord = new Case({
        ...MOCK_CASE,
        docketRecord: [
          {
            description: 'Petition',
            filedBy: 'Test Petitioner',
            filingDate: '2019-03-01T21:42:29.073Z',
          },
        ],
      });
      caseRecord.markAsSentToIRS('2018-12-04T18:27:13.370Z');
      assert.ok(caseRecord.irsSendDate);
      expect(caseRecord.docketRecord[0].status).toMatch(/^R served on/);
    });
  });

  describe('getCaseCaption', () => {
    it('party type Petitioner', () => {
      const caseTitle = Case.getCaseCaption(MOCK_CASE);
      expect(caseTitle).toEqual('Test Taxpayer, Petitioner');
    });

    it('party type Petitioner & Spouse', () => {
      const caseTitle = Case.getCaseCaption({
        ...MOCK_CASE,
        partyType: PARTY_TYPES.petitionerSpouse,
        contactSecondary: {
          name: 'Test Taxpayer 2',
        },
      });
      expect(caseTitle).toEqual('Test Taxpayer & Test Taxpayer 2, Petitioners');
    });

    it('party type Petitioner & Deceased Spouse', () => {
      const caseTitle = Case.getCaseCaption({
        ...MOCK_CASE,
        partyType: PARTY_TYPES.petitionerDeceasedSpouse,
        contactSecondary: {
          name: 'Test Taxpayer 2',
        },
      });
      expect(caseTitle).toEqual(
        'Test Taxpayer & Test Taxpayer 2, Deceased, Test Taxpayer, Surviving Spouse, Petitioners',
      );
    });

    it('party type Estate with an Executor/Personal Representative/Fiduciary/etc.', () => {
      const caseTitle = Case.getCaseCaption({
        ...MOCK_CASE,
        partyType: PARTY_TYPES.estate,
        contactSecondary: {
          name: 'Test Taxpayer 2',
        },
      });
      expect(caseTitle).toEqual(
        'Estate of Test Taxpayer 2, Deceased, Test Taxpayer, Executor, Petitioner(s)',
      );
    });

    it('party type Estate without an Executor/Personal Representative/Fiduciary/etc.', () => {
      const caseTitle = Case.getCaseCaption({
        ...MOCK_CASE,
        partyType: PARTY_TYPES.estateWithoutExecutor,
      });
      expect(caseTitle).toEqual(
        'Estate of Test Taxpayer, Deceased, Petitioner',
      );
    });

    it('party type Trust', () => {
      const caseTitle = Case.getCaseCaption({
        ...MOCK_CASE,
        partyType: PARTY_TYPES.trust,
        contactSecondary: {
          name: 'Test Taxpayer 2',
        },
      });
      expect(caseTitle).toEqual(
        'Test Taxpayer 2, Test Taxpayer, Trustee, Petitioner(s)',
      );
    });

    it('party type Corporation', () => {
      const caseTitle = Case.getCaseCaption({
        ...MOCK_CASE,
        partyType: PARTY_TYPES.corporation,
      });
      expect(caseTitle).toEqual('Test Taxpayer, Petitioner');
    });

    it('party type Partnership Tax Matters', () => {
      const caseTitle = Case.getCaseCaption({
        ...MOCK_CASE,
        partyType: PARTY_TYPES.partnershipAsTaxMattersPartner,
        contactSecondary: {
          name: 'Test Taxpayer 2',
        },
      });
      expect(caseTitle).toEqual(
        'Test Taxpayer 2, Test Taxpayer, Tax Matters Partner, Petitioner',
      );
    });

    it('party type Partnership Other Than Tax Matters', () => {
      const caseTitle = Case.getCaseCaption({
        ...MOCK_CASE,
        partyType: PARTY_TYPES.partnershipOtherThanTaxMatters,
        contactSecondary: {
          name: 'Test Taxpayer 2',
        },
      });
      expect(caseTitle).toEqual(
        'Test Taxpayer 2, Test Taxpayer, A Partner Other Than the Tax Matters Partner, Petitioner',
      );
    });

    it('party type Partnership BBA', () => {
      const caseTitle = Case.getCaseCaption({
        ...MOCK_CASE,
        partyType: PARTY_TYPES.partnershipBBA,
        contactSecondary: {
          name: 'Test Taxpayer 2',
        },
      });
      expect(caseTitle).toEqual(
        'Test Taxpayer 2, Test Taxpayer, Partnership Representative, Petitioner(s)',
      );
    });

    it('party type Conservator', () => {
      const caseTitle = Case.getCaseCaption({
        ...MOCK_CASE,
        partyType: PARTY_TYPES.conservator,
        contactSecondary: {
          name: 'Test Taxpayer 2',
        },
      });
      expect(caseTitle).toEqual(
        'Test Taxpayer 2, Test Taxpayer, Conservator, Petitioner',
      );
    });

    it('party type Guardian', () => {
      const caseTitle = Case.getCaseCaption({
        ...MOCK_CASE,
        partyType: PARTY_TYPES.guardian,
        contactSecondary: {
          name: 'Test Taxpayer 2',
        },
      });
      expect(caseTitle).toEqual(
        'Test Taxpayer 2, Test Taxpayer, Guardian, Petitioner',
      );
    });

    it('party type Custodian', () => {
      const caseTitle = Case.getCaseCaption({
        ...MOCK_CASE,
        partyType: PARTY_TYPES.custodian,
        contactSecondary: {
          name: 'Test Taxpayer 2',
        },
      });
      expect(caseTitle).toEqual(
        'Test Taxpayer 2, Test Taxpayer, Custodian, Petitioner',
      );
    });

    it('party type Minor', () => {
      const caseTitle = Case.getCaseCaption({
        ...MOCK_CASE,
        partyType: PARTY_TYPES.nextFriendForMinor,
        contactSecondary: {
          name: 'Test Taxpayer 2',
        },
      });
      expect(caseTitle).toEqual(
        'Test Taxpayer 2, Minor, Test Taxpayer, Next Friend, Petitioner',
      );
    });

    it('party type Legally Incompetent Person', () => {
      const caseTitle = Case.getCaseCaption({
        ...MOCK_CASE,
        partyType: PARTY_TYPES.nextFriendForIncompetentPerson,
        contactSecondary: {
          name: 'Test Taxpayer 2',
        },
      });
      expect(caseTitle).toEqual(
        'Test Taxpayer 2, Incompetent, Test Taxpayer, Next Friend, Petitioner',
      );
    });

    it('party type Donor', () => {
      const caseTitle = Case.getCaseCaption({
        ...MOCK_CASE,
        partyType: PARTY_TYPES.donor,
        contactSecondary: {
          name: 'Test Taxpayer 2',
        },
      });
      expect(caseTitle).toEqual('Test Taxpayer, Donor, Petitioner');
    });

    it('party type Transferee', () => {
      const caseTitle = Case.getCaseCaption({
        ...MOCK_CASE,
        partyType: PARTY_TYPES.transferee,
        contactSecondary: {
          name: 'Test Taxpayer 2',
        },
      });
      expect(caseTitle).toEqual('Test Taxpayer, Transferee, Petitioner');
    });

    it('party type Surviving Spouse', () => {
      const caseTitle = Case.getCaseCaption({
        ...MOCK_CASE,
        partyType: PARTY_TYPES.survivingSpouse,
        contactSecondary: {
          name: 'Test Taxpayer 2',
        },
      });
      expect(caseTitle).toEqual(
        'Test Taxpayer 2, Deceased, Test Taxpayer, Surviving Spouse, Petitioner',
      );
    });
  });

  describe('getCaseCaptionNames', () => {
    it('party type Petitioner', () => {
      const caseCaptionNames = Case.getCaseCaptionNames(
        'Test Taxpayer, Petitioner',
      );
      expect(caseCaptionNames).toEqual('Test Taxpayer');
    });

    it('party type Petitioner & Spouse', () => {
      const caseCaptionNames = Case.getCaseCaptionNames(
        'Test Taxpayer & Test Taxpayer 2, Petitioners',
      );
      expect(caseCaptionNames).toEqual('Test Taxpayer & Test Taxpayer 2');
    });

    it('party type Estate with an Executor/Personal Representative/Fiduciary/etc.', () => {
      const caseCaptionNames = Case.getCaseCaptionNames(
        'Estate of Test Taxpayer 2, Deceased, Test Taxpayer, Executor, Petitioner(s)',
      );
      expect(caseCaptionNames).toEqual(
        'Estate of Test Taxpayer 2, Deceased, Test Taxpayer, Executor',
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

    it('should add item to docket record when paid', () => {
      const caseRecord = new Case(MOCK_CASE);
      const payGovDate = new Date().toISOString();
      const initialDocketLength =
        (caseRecord.docketRecord && caseRecord.docketRecord.length) || 0;
      caseRecord.markAsPaidByPayGov(payGovDate);
      const docketLength = caseRecord.docketRecord.length;
      expect(docketLength).toEqual(initialDocketLength + 1);
    });

    it('should only sets docket record once per time paid', () => {
      const caseRecord = new Case(MOCK_CASE);
      caseRecord.markAsPaidByPayGov(new Date().toISOString());
      const docketLength = caseRecord.docketRecord.length;
      caseRecord.markAsPaidByPayGov(new Date().toISOString());
      caseRecord.markAsPaidByPayGov(new Date('2019-01-01').toISOString());
      caseRecord.markAsPaidByPayGov(new Date('2019-01-01').toISOString());
      expect(docketLength).toEqual(caseRecord.docketRecord.length);
    });
  });

  describe('addDocketRecord', () => {
    it('adds a new docketrecord', () => {
      const caseRecord = new Case(MOCK_CASE);
      caseRecord.addDocketRecord(
        new DocketRecord({
          description: 'test',
          filingDate: new Date().toISOString(),
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
    it('returns the case types for hasIrsNotice true', () => {
      const caseTypes = Case.getCaseTypes(true);
      expect(caseTypes).not.toBeNull();
      expect(caseTypes.length).toBeGreaterThan(1);
    });
    it('returns the case types for hasIrsNotice false', () => {
      const caseTypes = Case.getCaseTypes(false);
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
        documentId: '123',
        documentType: 'Answer',
        userId: 'respondent',
      });
      expect(caseToVerify.documents.length).toEqual(1);
      expect(caseToVerify.documents[0]).toMatchObject({
        documentId: '123',
        documentType: 'Answer',
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
    it('returns the filing types for user role petitioner', () => {
      const filingTypes = Case.getFilingTypes('petitioner');
      expect(filingTypes).not.toBeNull();
      expect(filingTypes.length).toEqual(4);
      expect(filingTypes[0]).toEqual('Myself');
    });

    it('returns the filing types for user role practitioner', () => {
      const filingTypes = Case.getFilingTypes('practitioner');
      expect(filingTypes).not.toBeNull();
      expect(filingTypes.length).toEqual(4);
      expect(filingTypes[0]).toEqual('Individual petitioner');
    });
  });

  describe('docket record suffix changes', () => {
    it('should save initial docket record suffix', () => {
      const caseToVerify = new Case({});
      expect(caseToVerify.initialDocketNumberSuffix).toEqual('_');
    });

    it('should not add a docket record item when the suffix updates from the initial suffix when the case is new', () => {
      const caseToVerify = new Case({
        docketNumber: 'Bob',
        initialDocketNumberSuffix: 'W',
        status: 'New',
      });
      expect(caseToVerify.docketRecord.length).toEqual(0);
    });

    it('should add a docket record item when the suffix is different from the initial suffix and the case is not new', () => {
      const caseToVerify = new Case({
        docketNumber: 'Bob',
        initialDocketNumberSuffix: 'W',
        status: 'Recalled',
      });
      expect(caseToVerify.docketRecord[0].description).toEqual(
        "Docket Number is amended from 'BobW' to 'Bob'",
      );
    });

    it('should remove a docket record entry when the suffix updates back to the initial suffix', () => {
      const caseToVerify = new Case({
        docketNumber: 'Bob',
        docketRecord: [
          {
            description: 'Petition',
          },
          {
            description: "Docket Number is amended from 'Bob' to 'BobW'",
          },
        ],
        initialDocketNumberSuffix: '_',
        status: 'Recalled',
      });
      expect(caseToVerify.docketRecord.length).toEqual(1);
    });

    it('should not update a docket record entry when the suffix was changed earlier', () => {
      const caseToVerify = new Case({
        docketNumber: 'Bob',
        docketRecord: [
          {
            description: "Docket Number is amended from 'BobW' to 'Bob'",
          },
          {
            description: 'Petition',
          },
        ],
        initialDocketNumberSuffix: 'W',
        status: 'Recalled',
      });
      expect(caseToVerify.docketRecord.length).toEqual(2);
      expect(caseToVerify.docketRecord[0].description).toEqual(
        "Docket Number is amended from 'BobW' to 'Bob'",
      );
    });
  });

  describe('updateCaseTitleDocketRecord', () => {
    it('should not add to the docket record when the caption is not set', () => {
      const caseToVerify = new Case({}).updateCaseTitleDocketRecord();
      expect(caseToVerify.docketRecord.length).toEqual(0);
    });

    it('should not add to the docket record when the caption is initially being set', () => {
      const caseToVerify = new Case({
        caseCaption: 'Caption',
      }).updateCaseTitleDocketRecord();
      expect(caseToVerify.docketRecord.length).toEqual(0);
    });

    it('should not add to the docket record when the caption equivalent to the initial title', () => {
      const caseToVerify = new Case({
        caseCaption: 'Caption',
        initialTitle: 'Caption v. Commissioner of Internal Revenue, Respondent',
      }).updateCaseTitleDocketRecord();
      expect(caseToVerify.docketRecord.length).toEqual(0);
    });

    it('should add to the docket record when the caption changes from the initial title', () => {
      const caseToVerify = new Case({
        caseCaption: 'A New Caption',
        initialTitle: 'Caption v. Commissioner of Internal Revenue, Respondent',
      }).updateCaseTitleDocketRecord();
      expect(caseToVerify.docketRecord.length).toEqual(1);
    });

    it('should not add to the docket record when the caption is equivalent to the last updated title', () => {
      const caseToVerify = new Case({
        caseCaption: 'A Very New Caption',
        docketRecord: [
          {
            description:
              "Caption of case is amended from 'Caption v. Commissioner of Internal Revenue, Respondent' to 'A New Caption v. Commissioner of Internal Revenue, Respondent'",
          },
          {
            description:
              "Caption of case is amended from 'A New Caption v. Commissioner of Internal Revenue, Respondent' to 'A Very New Caption v. Commissioner of Internal Revenue, Respondent'",
          },
        ],
        initialTitle: 'Caption v. Commissioner of Internal Revenue, Respondent',
      }).updateCaseTitleDocketRecord();
      expect(caseToVerify.docketRecord.length).toEqual(2);
    });

    it('should add to the docket record when the caption changes from the last updated title', () => {
      const caseToVerify = new Case({
        caseCaption: 'A Very Berry New Caption',
        docketRecord: [
          {
            description:
              "Caption of case is amended from 'Caption v. Commissioner of Internal Revenue, Respondent' to 'A New Caption v. Commissioner of Internal Revenue, Respondent'",
          },
          {
            description:
              "Caption of case is amended from 'A New Caption v. Commissioner of Internal Revenue, Respondent' to 'A Very New Caption v. Commissioner of Internal Revenue, Respondent'",
          },
        ],
        initialTitle: 'Caption v. Commissioner of Internal Revenue, Respondent',
      }).updateCaseTitleDocketRecord();
      expect(caseToVerify.docketRecord.length).toEqual(3);
    });
  });
});
