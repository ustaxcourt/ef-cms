const moment = require('moment');
const { Case } = require('./Case');
const { ContactFactory } = require('../contacts/ContactFactory');
const { DocketRecord } = require('../DocketRecord');
const { MOCK_CASE } = require('../../../test/mockCase');
const { MOCK_DOCUMENTS } = require('../../../test/mockDocuments');
const { WorkItem } = require('../WorkItem');

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
      orderToChangeDesignatedPlaceOfTrial: false,
      orderToShowCause: false,
    });
  });

  it('defaults the orderDesignatingPlaceOfTrial to false if not a paper case or trial city is set', () => {
    let myCase = new Case(MOCK_CASE);
    expect(myCase).toMatchObject({
      orderDesignatingPlaceOfTrial: false,
    });

    myCase = new Case({
      ...MOCK_CASE,
      isPaper: true,
    });
    expect(myCase).toMatchObject({
      orderDesignatingPlaceOfTrial: false,
    });
  });

  it('defaults the orderDesignatingPlaceOfTrial to true if paper case and trial city is not set', () => {
    const myCase = new Case({
      ...MOCK_CASE,
      isPaper: true,
      preferredTrialCity: undefined,
    });
    expect(myCase).toMatchObject({
      orderDesignatingPlaceOfTrial: true,
    });
  });

  it('sets the expected order booleans', () => {
    const myCase = new Case({
      ...MOCK_CASE,
      noticeOfAttachments: true,
      orderDesignatingPlaceOfTrial: true,
      orderForAmendedPetition: false,
      orderForAmendedPetitionAndFilingFee: false,
      orderForFilingFee: true,
      orderForOds: false,
      orderForRatification: false,
      orderToChangeDesignatedPlaceOfTrial: true,
      orderToShowCause: true,
    });
    expect(myCase).toMatchObject({
      noticeOfAttachments: true,
      orderDesignatingPlaceOfTrial: true,
      orderForAmendedPetition: false,
      orderForAmendedPetitionAndFilingFee: false,
      orderForFilingFee: true,
      orderForOds: false,
      orderForRatification: false,
      orderToChangeDesignatedPlaceOfTrial: true,
      orderToShowCause: true,
    });
  });

  describe('isValid', () => {
    it('Creates a valid case', () => {
      const myCase = new Case(MOCK_CASE);
      expect(myCase.isValid()).toBeTruthy();
    });

    it('Creates a valid case from an already existing case json', () => {
      const myCase = new Case(MOCK_CASE);
      expect(myCase.isValid()).toBeTruthy();
    });

    it('adds a paygov date to an already existing case json', () => {
      const myCase = new Case({ payGovId: '1234', ...MOCK_CASE });
      expect(myCase.isValid()).toBeTruthy();
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
      expect(myCase.isValid()).toBeFalsy();
    });

    it('Creates an invalid case with no documents', () => {
      const myCase = new Case({
        documents: [],
      });
      expect(myCase.isValid()).toBeFalsy();
    });

    it('Creates an invalid case with empty object', () => {
      const myCase = new Case({});
      expect(myCase.isValid()).toBeFalsy();
    });

    it('Creates an invalid case with no petitioners', () => {
      const myCase = new Case({
        petitioners: [],
      });
      expect(myCase.isValid()).toBeFalsy();
    });
  });

  describe('validate', () => {
    it('should do nothing if valid', () => {
      let error;
      try {
        new Case(MOCK_CASE).validate();
      } catch (err) {
        error = err;
      }
      expect(error).not.toBeDefined();
    });

    it('should throw an error on invalid cases', () => {
      let error;
      try {
        new Case({}).validate();
      } catch (err) {
        error = err;
      }
      expect(error).toBeDefined();
    });
  });

  describe('isValidCaseId', () => {
    it('returns true if a valid uuid', () => {
      expect(
        Case.isValidCaseId('c54ba5a9-b37b-479d-9201-067ec6e335bb'),
      ).toBeTruthy();
    });

    it('returns false if a invalid uuid', () => {
      expect(
        Case.isValidCaseId('XXX54ba5a9-b37b-479d-9201-067ec6e335bb'),
      ).toBeFalsy();
    });
  });

  describe('isValidDocketNumber', () => {
    it('returns true if a valid docketNumber', () => {
      expect(Case.isValidDocketNumber('00101-00')).toBeTruthy();
    });

    it('returns false if a invalid docketnumber', () => {
      expect(Case.isValidDocketNumber('00')).toBeFalsy();
    });
  });

  describe('markAsSentToIRS', () => {
    it('sets irsSendDate', () => {
      const caseRecord = new Case(MOCK_CASE);
      caseRecord.markAsSentToIRS('2018-12-04T18:27:13.370Z');
      expect(caseRecord.irsSendDate).toBeDefined();
    });
    it('updates docket record status on petition documents', () => {
      const caseRecord = new Case({
        ...MOCK_CASE,
        docketRecord: [
          {
            description: 'Petition',
            documentId: '123',
            filedBy: 'Test Petitioner',
            filingDate: '2019-03-01T21:42:29.073Z',
          },
          {
            description:
              'Request for Place of Trial at Charleston, West Virginia',
            filingDate: '2019-03-01T21:42:29.073Z',
          },
        ],
      });
      caseRecord.markAsSentToIRS('2018-12-04T18:27:13.370Z');
      expect(caseRecord.irsSendDate).toBeDefined();
      expect(caseRecord.docketRecord[0].status).toMatch(/^R served on/);
      expect(caseRecord.docketRecord[1].status).toBeUndefined();
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
        partyType: ContactFactory.PARTY_TYPES.petitionerSpouse,
        contactSecondary: {
          name: 'Test Taxpayer 2',
        },
      });
      expect(caseTitle).toEqual('Test Taxpayer & Test Taxpayer 2, Petitioners');
    });

    it('party type Petitioner & Deceased Spouse', () => {
      const caseTitle = Case.getCaseCaption({
        ...MOCK_CASE,
        partyType: ContactFactory.PARTY_TYPES.petitionerDeceasedSpouse,
        contactSecondary: {
          name: 'Test Taxpayer 2',
        },
      });
      expect(caseTitle).toEqual(
        'Test Taxpayer & Test Taxpayer 2, Deceased, Test Taxpayer, Surviving Spouse, Petitioners',
      );
    });

    it('party type Estate with an Executor/Personal Representative/Fiduciary/etc.', () => {
      const mockCase = {
        ...MOCK_CASE,
        partyType: ContactFactory.PARTY_TYPES.estate,
      };
      mockCase.contactPrimary.secondaryName = 'Test Taxpayer 2';
      const caseTitle = Case.getCaseCaption(mockCase);
      expect(caseTitle).toEqual(
        'Estate of Test Taxpayer, Deceased, Test Taxpayer 2, Executor, Petitioner(s)',
      );
    });

    it('party type Estate without an Executor/Personal Representative/Fiduciary/etc.', () => {
      const caseTitle = Case.getCaseCaption({
        ...MOCK_CASE,
        partyType: ContactFactory.PARTY_TYPES.estateWithoutExecutor,
      });
      expect(caseTitle).toEqual(
        'Estate of Test Taxpayer, Deceased, Petitioner',
      );
    });

    it('party type Trust', () => {
      const mockCase = {
        ...MOCK_CASE,
        partyType: ContactFactory.PARTY_TYPES.trust,
      };
      mockCase.contactPrimary.secondaryName = 'Test Taxpayer 2';
      const caseTitle = Case.getCaseCaption(mockCase);
      expect(caseTitle).toEqual(
        'Test Taxpayer, Test Taxpayer 2, Trustee, Petitioner(s)',
      );
    });

    it('party type Corporation', () => {
      const caseTitle = Case.getCaseCaption({
        ...MOCK_CASE,
        partyType: ContactFactory.PARTY_TYPES.corporation,
      });
      expect(caseTitle).toEqual('Test Taxpayer, Petitioner');
    });

    it('party type Partnership Tax Matters', () => {
      const mockCase = {
        ...MOCK_CASE,
        partyType: ContactFactory.PARTY_TYPES.partnershipAsTaxMattersPartner,
      };
      mockCase.contactPrimary.secondaryName = 'Test Taxpayer 2';
      const caseTitle = Case.getCaseCaption(mockCase);
      expect(caseTitle).toEqual(
        'Test Taxpayer, Test Taxpayer 2, Tax Matters Partner, Petitioner',
      );
    });

    it('party type Partnership Other Than Tax Matters', () => {
      const mockCase = {
        ...MOCK_CASE,
        partyType: ContactFactory.PARTY_TYPES.partnershipOtherThanTaxMatters,
      };
      mockCase.contactPrimary.secondaryName = 'Test Taxpayer 2';
      const caseTitle = Case.getCaseCaption(mockCase);
      expect(caseTitle).toEqual(
        'Test Taxpayer, Test Taxpayer 2, A Partner Other Than the Tax Matters Partner, Petitioner',
      );
    });

    it('party type Partnership BBA', () => {
      const mockCase = {
        ...MOCK_CASE,
        partyType: ContactFactory.PARTY_TYPES.partnershipBBA,
      };
      mockCase.contactPrimary.secondaryName = 'Test Taxpayer 2';
      const caseTitle = Case.getCaseCaption(mockCase);
      expect(caseTitle).toEqual(
        'Test Taxpayer, Test Taxpayer 2, Partnership Representative, Petitioner(s)',
      );
    });

    it('party type Conservator', () => {
      const mockCase = {
        ...MOCK_CASE,
        partyType: ContactFactory.PARTY_TYPES.conservator,
      };
      mockCase.contactPrimary.secondaryName = 'Test Taxpayer 2';
      const caseTitle = Case.getCaseCaption(mockCase);
      expect(caseTitle).toEqual(
        'Test Taxpayer, Test Taxpayer 2, Conservator, Petitioner',
      );
    });

    it('party type Guardian', () => {
      const mockCase = {
        ...MOCK_CASE,
        partyType: ContactFactory.PARTY_TYPES.guardian,
      };
      mockCase.contactPrimary.secondaryName = 'Test Taxpayer 2';
      const caseTitle = Case.getCaseCaption(mockCase);
      expect(caseTitle).toEqual(
        'Test Taxpayer, Test Taxpayer 2, Guardian, Petitioner',
      );
    });

    it('party type Custodian', () => {
      const mockCase = {
        ...MOCK_CASE,
        partyType: ContactFactory.PARTY_TYPES.custodian,
      };
      mockCase.contactPrimary.secondaryName = 'Test Taxpayer 2';
      const caseTitle = Case.getCaseCaption(mockCase);
      expect(caseTitle).toEqual(
        'Test Taxpayer, Test Taxpayer 2, Custodian, Petitioner',
      );
    });

    it('party type Minor', () => {
      const mockCase = {
        ...MOCK_CASE,
        partyType: ContactFactory.PARTY_TYPES.nextFriendForMinor,
      };
      mockCase.contactPrimary.secondaryName = 'Test Taxpayer 2';
      const caseTitle = Case.getCaseCaption(mockCase);
      expect(caseTitle).toEqual(
        'Test Taxpayer, Minor, Test Taxpayer 2, Next Friend, Petitioner',
      );
    });

    it('party type Legally Incompetent Person', () => {
      const mockCase = {
        ...MOCK_CASE,
        partyType: ContactFactory.PARTY_TYPES.nextFriendForIncompetentPerson,
      };
      mockCase.contactPrimary.secondaryName = 'Test Taxpayer 2';
      const caseTitle = Case.getCaseCaption(mockCase);
      expect(caseTitle).toEqual(
        'Test Taxpayer, Incompetent, Test Taxpayer 2, Next Friend, Petitioner',
      );
    });

    it('party type Donor', () => {
      const caseTitle = Case.getCaseCaption({
        ...MOCK_CASE,
        partyType: ContactFactory.PARTY_TYPES.donor,
      });
      expect(caseTitle).toEqual('Test Taxpayer, Donor, Petitioner');
    });

    it('party type Transferee', () => {
      const caseTitle = Case.getCaseCaption({
        ...MOCK_CASE,
        partyType: ContactFactory.PARTY_TYPES.transferee,
      });
      expect(caseTitle).toEqual('Test Taxpayer, Transferee, Petitioner');
    });

    it('party type Surviving Spouse', () => {
      const mockCase = {
        ...MOCK_CASE,
        partyType: ContactFactory.PARTY_TYPES.survivingSpouse,
      };
      mockCase.contactPrimary.secondaryName = 'Test Taxpayer 2';
      const caseTitle = Case.getCaseCaption(mockCase);
      expect(caseTitle).toEqual(
        'Test Taxpayer, Deceased, Test Taxpayer 2, Surviving Spouse, Petitioner',
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
      expect(caseRecord.payGovDate).toBeDefined();
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

    it('should only set docket record once per time paid', () => {
      const caseRecord = new Case(MOCK_CASE);
      caseRecord.markAsPaidByPayGov(new Date().toISOString());
      const docketLength = caseRecord.docketRecord.length;
      caseRecord.markAsPaidByPayGov(new Date().toISOString());
      caseRecord.markAsPaidByPayGov(new Date('2019-01-01').toISOString());
      caseRecord.markAsPaidByPayGov(new Date('2019-01-01').toISOString());
      expect(docketLength).toEqual(caseRecord.docketRecord.length);
    });

    it('should overwrite existing docket record entry if one already exists', () => {
      const caseRecord = new Case(MOCK_CASE);
      caseRecord.addDocketRecord(
        new DocketRecord({
          description: 'Some Description',
          filingDate: new Date().toISOString(),
        }),
      );
      caseRecord.addDocketRecord(
        new DocketRecord({
          description: 'Filing fee paid',
          filingDate: new Date().toISOString(),
        }),
      );
      caseRecord.markAsPaidByPayGov(new Date().toISOString());
      expect(caseRecord.docketRecord.length).toEqual(5);
    });
  });

  describe('setRequestForTrialDocketRecord', () => {
    it('sets request for trial docket record when it does not already exist', () => {
      const caseRecord = new Case(MOCK_CASE);
      const preferredTrialCity = 'Mobile, Alabama';
      const initialDocketLength =
        (caseRecord.docketRecord && caseRecord.docketRecord.length) || 0;
      caseRecord.setRequestForTrialDocketRecord(preferredTrialCity);
      const docketLength = caseRecord.docketRecord.length;
      expect(docketLength).toEqual(initialDocketLength + 1);
    });

    it('should only set docket record once for request for trial', () => {
      const caseRecord = new Case(MOCK_CASE);
      const preferredTrialCity = 'Mobile, Alabama';
      caseRecord.setRequestForTrialDocketRecord(preferredTrialCity);
      const docketLength = caseRecord.docketRecord.length;
      caseRecord.setRequestForTrialDocketRecord('Birmingham, Alabama');
      caseRecord.setRequestForTrialDocketRecord('Somecity, USA');
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
          index: 5,
        }),
      );

      expect(caseRecord.docketRecord).toHaveLength(4);
      expect(caseRecord.docketRecord[3].description).toEqual('test');
      expect(caseRecord.docketRecord[3].index).toEqual(5);

      caseRecord.addDocketRecord(
        new DocketRecord({
          description: 'sdfs',
          filingDate: new Date().toISOString(),
        }),
      );

      expect(caseRecord.docketRecord[4].index).toEqual(6);
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

  describe('updateDocketRecordEntry', () => {
    it('updates an existing docketrecord', () => {
      const caseRecord = new Case(MOCK_CASE);
      const updatedDocketEntry = new DocketRecord({
        description: 'second record now updated',
        documentId: '8675309b-28d0-43ec-bafb-654e83405412',
        filingDate: '2018-03-02T22:22:00.000Z',
        index: 7,
      });
      caseRecord.updateDocketRecordEntry(updatedDocketEntry);

      expect(caseRecord.docketRecord).toHaveLength(3); // unchanged
      expect(caseRecord.docketRecord[1].description).toEqual(
        'second record now updated',
      );
      expect(caseRecord.docketRecord[1].index).toEqual(7);
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
      expect(error).toBeDefined();
      expect(error.message).toContain('Imarealerror');
    });

    it('does not pass back an error passed in if valid', () => {
      let error;
      const caseRecord = new Case(MOCK_CASE);
      try {
        caseRecord.validateWithError(new Error('Imarealerror'));
      } catch (e) {
        error = e;
      }
      expect(error).not.toBeDefined();
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
      expect(caseToVerify.respondents).not.toBeNull();
      expect(caseToVerify.respondents[0].userId).toEqual('respondent');
    });
  });

  describe('attachPractitioner', () => {
    it('adds the user to the practitioners', () => {
      const caseToVerify = new Case({});
      caseToVerify.attachPractitioner({
        user: {
          userId: 'practitioner',
        },
      });
      expect(caseToVerify.practitioners).not.toBeNull();
      expect(caseToVerify.practitioners[0].userId).toEqual('practitioner');
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
      const procedureTypes = Case.PROCEDURE_TYPES;
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

    it('returns the filing types for user role petitioner as default', () => {
      const filingTypes = Case.getFilingTypes();
      expect(filingTypes).not.toBeNull();
      expect(filingTypes.length).toEqual(4);
      expect(filingTypes[0]).toEqual('Myself');
    });

    it('returns the filing types for user role petitioner for unknown role', () => {
      const filingTypes = Case.getFilingTypes('whodat');
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

  describe('updateDocketNumberRecord records suffix changes', () => {
    it('should create a docket record when the suffix updates', () => {
      const caseToVerify = new Case({ docketNumber: '123-19' });
      expect(caseToVerify.initialDocketNumberSuffix).toEqual('_');
      caseToVerify.docketNumberSuffix = 'W';
      caseToVerify.updateDocketNumberRecord();
      expect(caseToVerify.docketRecord.length).toEqual(1);
    });

    it('should not create a docket record if suffix has not changed', () => {
      const caseToVerify = new Case({ docketNumber: '123-19' });
      expect(caseToVerify.initialDocketNumberSuffix).toEqual('_');
      caseToVerify.updateDocketNumberRecord();
      expect(caseToVerify.docketRecord.length).toEqual(0);
    });

    it('should add to the docket record when the docket number changes from the last updated docket number', () => {
      const caseToVerify = new Case({
        caseCaption: 'A Very Berry New Caption',
        docketNumber: '123-19',
        docketRecord: [
          {
            description: "Docket Number is amended from '123-19A' to '123-19B'",
          },
          {
            description: "Docket Number is amended from '123-19B' to '123-19P'",
          },
        ],
      });
      caseToVerify.docketNumberSuffix = 'W';
      caseToVerify.updateDocketNumberRecord();
      expect(caseToVerify.docketRecord.length).toEqual(3);
      expect(caseToVerify.docketRecord[2].description).toEqual(
        "Docket Number is amended from '123-19P' to '123-19W'",
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

    it('should not add to the docket record when the caption is equivalent to the initial title', () => {
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

  describe('getWorkItems', () => {
    it('should get all the work items associated with the documents in the case', () => {
      const myCase = new Case(MOCK_CASE);
      myCase.addDocument({
        documentId: '123',
        documentType: 'Answer',
        userId: 'respondent',
      });
      const workItem = new WorkItem({
        assigneeId: 'bob',
        assigneeName: 'bob',
        caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        caseStatus: 'new',
        caseTitle: 'testing',
        docketNumber: '101-18',
        document: {},
        sentBy: 'bob',
      });
      myCase.documents[0].addWorkItem(workItem);
      const workItems = myCase.getWorkItems();
      expect(workItems.length).toEqual(1);
      expect(workItems).toMatchObject([
        {
          assigneeId: 'bob',
          assigneeName: 'bob',
          caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
          caseStatus: 'new',
          caseTitle: 'testing',
          docketNumber: '101-18',
          document: {},
          sentBy: 'bob',
        },
      ]);
    });
  });

  describe('checkForReadyForTrial', () => {
    it('should not change the status if no answer documents have been filed', () => {
      const caseToCheck = new Case({
        documents: [],
        status: Case.STATUS_TYPES.generalDocket,
      }).checkForReadyForTrial();
      expect(caseToCheck.status).toEqual(Case.STATUS_TYPES.generalDocket);
    });

    it('should not change the status if an answer document has been filed, but the cutoff has not elapsed', () => {
      const caseToCheck = new Case({
        documents: [
          {
            createdAt: moment().toISOString(),
            eventCode: 'A',
          },
        ],
        status: Case.STATUS_TYPES.generalDocket,
      }).checkForReadyForTrial();
      expect(caseToCheck.status).toEqual(Case.STATUS_TYPES.generalDocket);
    });

    it('should not change the status if a non answer document has been filed before the cutoff', () => {
      const caseToCheck = new Case({
        documents: [
          {
            createdAt: moment()
              .subtract(1, 'year')
              .toISOString(),
            eventCode: 'ZZZs',
          },
        ],
        status: Case.STATUS_TYPES.generalDocket,
      }).checkForReadyForTrial();
      expect(caseToCheck.status).toEqual(Case.STATUS_TYPES.generalDocket);
    });

    it("should not change the status to 'Ready for Trial' when an answer document has been filed on the cutoff", () => {
      const caseToCheck = new Case({
        documents: [
          {
            createdAt: moment()
              .subtract(Case.ANSWER_CUTOFF_AMOUNT, Case.ANSWER_CUTOFF_UNIT)
              .toISOString(),
            eventCode: 'A',
          },
        ],
        status: Case.STATUS_TYPES.generalDocket,
      }).checkForReadyForTrial();

      expect(caseToCheck.status).not.toEqual(
        Case.STATUS_TYPES.generalDocketReadyForTrial,
      );
    });

    it("should not change the status to 'Ready for Trial' when an answer document has been filed before the cutoff but case is not 'Not at issue'", () => {
      const createdAt = moment()
        .subtract(Case.ANSWER_CUTOFF_AMOUNT + 10, Case.ANSWER_CUTOFF_UNIT)
        .toISOString();

      const caseToCheck = new Case({
        documents: [
          {
            createdAt,
            eventCode: 'A',
          },
        ],
        status: Case.STATUS_TYPES.new,
      }).checkForReadyForTrial();

      expect(caseToCheck.status).toEqual(Case.STATUS_TYPES.new);
    });

    it("should change the status to 'Ready for Trial' when an answer document has been filed before the cutoff", () => {
      const createdAt = moment()
        .subtract(Case.ANSWER_CUTOFF_AMOUNT + 10, Case.ANSWER_CUTOFF_UNIT)
        .toISOString();

      const caseToCheck = new Case({
        documents: [
          {
            createdAt,
            eventCode: 'A',
          },
        ],
        status: Case.STATUS_TYPES.generalDocket,
      }).checkForReadyForTrial();

      expect(caseToCheck.status).toEqual(
        Case.STATUS_TYPES.generalDocketReadyForTrial,
      );
    });
  });

  describe('generateTrialSortTags', () => {
    it('should generate sort tags for a regular case', () => {
      const myCase = new Case({
        ...MOCK_CASE,
        createdAt: '2018-12-12T05:00:00Z',
      });
      expect(myCase.generateTrialSortTags()).toEqual({
        hybrid:
          'WashingtonDC-H-C-20181212000000-c54ba5a9-b37b-479d-9201-067ec6e335bb',
        nonHybrid:
          'WashingtonDC-R-C-20181212000000-c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
    });

    it('should generate sort tags for a small case', () => {
      const myCase = new Case({
        ...MOCK_CASE,
        createdAt: '2018-12-12T05:00:00Z',
        procedureType: 'Small',
      });
      expect(myCase.generateTrialSortTags()).toEqual({
        hybrid:
          'WashingtonDC-H-C-20181212000000-c54ba5a9-b37b-479d-9201-067ec6e335bb',
        nonHybrid:
          'WashingtonDC-S-C-20181212000000-c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
    });

    it('should generate sort tags for a prioritized P case', () => {
      const myCase = new Case({
        ...MOCK_CASE,
        createdAt: '2018-12-12T05:00:00Z',
        caseType: 'passport',
      });
      expect(myCase.generateTrialSortTags()).toEqual({
        hybrid:
          'WashingtonDC-H-B-20181212000000-c54ba5a9-b37b-479d-9201-067ec6e335bb',
        nonHybrid:
          'WashingtonDC-R-B-20181212000000-c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
    });

    it('should generate sort tags for a prioritized L case', () => {
      const myCase = new Case({
        ...MOCK_CASE,
        createdAt: '2018-12-12T05:00:00Z',
        caseType: 'cdp (lien/levy)',
      });
      expect(myCase.generateTrialSortTags()).toEqual({
        hybrid:
          'WashingtonDC-H-A-20181212000000-c54ba5a9-b37b-479d-9201-067ec6e335bb',
        nonHybrid:
          'WashingtonDC-R-A-20181212000000-c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
    });
  });

  describe('setAsCalendared', () => {
    it('should set case as calendared', () => {
      const myCase = new Case({
        ...MOCK_CASE,
      });
      myCase.setAsCalendared({
        judge: {
          name: 'Judge Judy',
        },
        trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
      expect(myCase.trialSessionId).toBeTruthy();
      expect(myCase.status).toEqual(Case.STATUS_TYPES.calendared);
    });
  });

  describe('closeCase', () => {
    it('should update the status of the case to closed', () => {
      const myCase = new Case({
        ...MOCK_CASE,
      });
      myCase.closeCase();
      expect(myCase.status).toEqual(Case.STATUS_TYPES.closed);
    });
  });

  describe('recallFromIRSHoldingQueue', () => {
    it('should update the status of the case to recalled', () => {
      const myCase = new Case({
        ...MOCK_CASE,
      });
      myCase.recallFromIRSHoldingQueue();
      expect(myCase.status).toEqual(Case.STATUS_TYPES.recalled);
    });
  });

  describe('getDocumentById', () => {
    it('should get the document by an Id', () => {
      const myCase = new Case({
        ...MOCK_CASE,
      });
      const result = myCase.getDocumentById({
        documentId: MOCK_DOCUMENTS[0].documentId,
      });
      expect(result.documentId).toEqual(MOCK_DOCUMENTS[0].documentId);
    });
  });

  describe('stripLeadingZeros', () => {
    it('should remove leading zeros', () => {
      const result = Case.stripLeadingZeros('000101-19');
      expect(result).toEqual('101-19');
    });
  });

  describe('updateDocument', () => {
    it('should update the document', () => {
      const myCase = new Case({
        ...MOCK_CASE,
      });
      myCase.updateDocument({
        documentId: MOCK_DOCUMENTS[0].documentId,
        processingStatus: 'success',
      });
      expect(myCase.documents[0].processingStatus).toEqual('success');
    });
  });
});
