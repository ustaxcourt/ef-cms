const moment = require('moment');
const {
  MOCK_CASE,
  MOCK_CASE_WITHOUT_PENDING,
} = require('../../../test/mockCase');
const { Case } = require('./Case');
const { ContactFactory } = require('../contacts/ContactFactory');
const { DocketRecord } = require('../DocketRecord');
const { MOCK_DOCUMENTS } = require('../../../test/mockDocuments');
const { Practitioner } = require('../Practitioner');
const { Respondent } = require('../Respondent');
const { TrialSession } = require('../trialSessions/TrialSession');
const { User } = require('../User');
const { WorkItem } = require('../WorkItem');

describe('Case entity', () => {
  let applicationContext;

  beforeAll(() => {
    applicationContext = {
      getUniqueId: () => 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    };
  });

  it('should throw an error if app context is not passed in', () => {
    expect(() => new Case({}, {})).toThrow();
  });

  it('defaults the orders to false', () => {
    const myCase = new Case(MOCK_CASE, { applicationContext });
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
    let myCase = new Case(MOCK_CASE, { applicationContext });
    expect(myCase).toMatchObject({
      orderDesignatingPlaceOfTrial: false,
    });

    myCase = new Case(
      {
        ...MOCK_CASE,
        isPaper: true,
      },
      {
        applicationContext,
      },
    );
    expect(myCase).toMatchObject({
      orderDesignatingPlaceOfTrial: false,
    });
  });

  it('defaults the orderDesignatingPlaceOfTrial to true if paper case and trial city is not set', () => {
    const myCase = new Case(
      {
        ...MOCK_CASE,
        isPaper: true,
        preferredTrialCity: undefined,
      },
      {
        applicationContext,
      },
    );
    expect(myCase).toMatchObject({
      orderDesignatingPlaceOfTrial: true,
    });
  });

  it('sets the expected order booleans', () => {
    const myCase = new Case(
      {
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
      },
      {
        applicationContext,
      },
    );
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

  describe('toRawObject', () => {
    beforeEach(() => {
      jest.spyOn(Case.prototype, 'doesHavePendingItems');
    });

    afterEach(() => {
      Case.prototype.doesHavePendingItems.mockRestore();
    });

    it('calls own function to update values after decorated toRawObject', () => {
      const myCase = new Case({}, { applicationContext });
      const result = myCase.toRawObject();
      expect(Case.prototype.doesHavePendingItems).toHaveBeenCalled();
      expect(result.hasPendingItems).toBeFalsy();
    });
  });

  describe('isValid', () => {
    it('Creates a valid case', () => {
      const myCase = new Case(MOCK_CASE, {
        applicationContext,
      });
      expect(myCase.isValid()).toBeTruthy();
    });

    it('Creates a valid case from an already existing case json', () => {
      const myCase = new Case(MOCK_CASE, {
        applicationContext,
      });
      expect(myCase.isValid()).toBeTruthy();
    });

    it('adds a paygov date to an already existing case json', () => {
      const myCase = new Case(
        { payGovId: '1234', ...MOCK_CASE },
        {
          applicationContext,
        },
      );
      expect(myCase.isValid()).toBeTruthy();
    });

    it('Creates an invalid case with a document', () => {
      const myCase = new Case(
        {
          documents: [
            {
              documentId: '123',
              documentType: 'testing',
            },
          ],
          petitioners: [{ name: 'Test Petitioner' }],
        },
        {
          applicationContext,
        },
      );
      expect(myCase.isValid()).toBeFalsy();
    });

    it('Creates an invalid case with no documents', () => {
      const myCase = new Case(
        {
          documents: [],
        },
        {
          applicationContext,
        },
      );
      expect(myCase.isValid()).toBeFalsy();
    });

    it('Creates an invalid case with empty object', () => {
      const myCase = new Case(
        {},
        {
          applicationContext,
        },
      );
      expect(myCase.isValid()).toBeFalsy();
    });

    it('Creates an invalid case with no petitioners', () => {
      const myCase = new Case(
        {
          petitioners: [],
        },
        {
          applicationContext,
        },
      );
      expect(myCase.isValid()).toBeFalsy();
    });

    it('Creates an invalid case with blocked set to true but no blockedReason or blockedDate', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
          blocked: true,
        },
        {
          applicationContext,
        },
      );
      expect(myCase.isValid()).toBeFalsy();
    });

    it('Creates an invalid case with blocked set to true and a blockedDate but no blockedReason', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
          blocked: true,
          blockedDate: '2019-03-01T21:42:29.073Z',
        },
        {
          applicationContext,
        },
      );
      expect(myCase.isValid()).toBeFalsy();
    });

    it('Creates an invalid case with blocked set to true and an invalid blockedDate', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
          blocked: true,
          blockedDate: 'undefined-undefined-undefined',
          blockedReason: 'something',
        },
        {
          applicationContext,
        },
      );
      expect(myCase.isValid()).toBeFalsy();
    });

    it('Creates a valid case with blocked set to false but no blockedReason', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
          blocked: false,
        },
        {
          applicationContext,
        },
      );
      expect(myCase.isValid()).toBeTruthy();
    });

    it('Creates a valid case with blocked set to true and a blockedReason and blockedDate', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
          blocked: true,
          blockedDate: '2019-03-01T21:42:29.073Z',
          blockedReason: 'something',
        },
        {
          applicationContext,
        },
      );
      expect(myCase.isValid()).toBeTruthy();
    });

    it('Creates an invalid case with highPriority set to true but no highPriorityReason', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
          highPriority: true,
        },
        {
          applicationContext,
        },
      );
      expect(myCase.isValid()).toBeFalsy();
    });

    it('Creates a valid case with highPriority set to true and a highPriorityReason', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
          highPriority: true,
          highPriorityReason: 'something',
        },
        {
          applicationContext,
        },
      );
      expect(myCase.isValid()).toBeTruthy();
    });
  });

  describe('validate', () => {
    it('should do nothing if valid', () => {
      let error;
      try {
        new Case(MOCK_CASE, {
          applicationContext,
        }).validate();
      } catch (err) {
        error = err;
      }
      expect(error).not.toBeDefined();
    });

    it('should throw an error on invalid cases', () => {
      let error;
      try {
        new Case(
          {},
          {
            applicationContext,
          },
        ).validate();
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
      const caseRecord = new Case(MOCK_CASE, {
        applicationContext,
      });
      caseRecord.markAsSentToIRS('2018-12-04T18:27:13.370Z');
      expect(caseRecord.irsSendDate).toBeDefined();
    });
    it('updates docket record status on petition documents', () => {
      const caseRecord = new Case(
        {
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
        },
        {
          applicationContext,
        },
      );
      caseRecord.markAsSentToIRS('2018-12-04T18:27:13.370Z');
      expect(caseRecord.irsSendDate).toBeDefined();
      expect(caseRecord.docketRecord[0].status).toMatch(/^R served on/);
      expect(caseRecord.docketRecord[1].status).toBeUndefined();
    });
  });

  describe('getCaseCaption', () => {
    it('party type Petitioner', () => {
      const caseTitle = Case.getCaseCaption(MOCK_CASE);
      expect(caseTitle).toEqual('Test Petitioner, Petitioner');
    });

    it('party type Petitioner & Spouse', () => {
      const caseTitle = Case.getCaseCaption({
        ...MOCK_CASE,
        contactSecondary: {
          name: 'Test Petitioner 2',
        },
        partyType: ContactFactory.PARTY_TYPES.petitionerSpouse,
      });
      expect(caseTitle).toEqual(
        'Test Petitioner & Test Petitioner 2, Petitioners',
      );
    });

    it('party type Petitioner & Deceased Spouse', () => {
      const caseTitle = Case.getCaseCaption({
        ...MOCK_CASE,
        contactSecondary: {
          name: 'Test Petitioner 2',
        },
        partyType: ContactFactory.PARTY_TYPES.petitionerDeceasedSpouse,
      });
      expect(caseTitle).toEqual(
        'Test Petitioner & Test Petitioner 2, Deceased, Test Petitioner, Surviving Spouse, Petitioners',
      );
    });

    it('party type Estate with an Executor/Personal Representative/Fiduciary/etc.', () => {
      const mockCase = {
        ...MOCK_CASE,
        partyType: ContactFactory.PARTY_TYPES.estate,
      };
      mockCase.contactPrimary.secondaryName = 'Test Petitioner 2';
      const caseTitle = Case.getCaseCaption(mockCase);
      expect(caseTitle).toEqual(
        'Estate of Test Petitioner, Deceased, Test Petitioner 2, Executor, Petitioner(s)',
      );
    });

    it('party type Estate without an Executor/Personal Representative/Fiduciary/etc.', () => {
      const caseTitle = Case.getCaseCaption({
        ...MOCK_CASE,
        partyType: ContactFactory.PARTY_TYPES.estateWithoutExecutor,
      });
      expect(caseTitle).toEqual(
        'Estate of Test Petitioner, Deceased, Petitioner',
      );
    });

    it('party type Trust', () => {
      const mockCase = {
        ...MOCK_CASE,
        partyType: ContactFactory.PARTY_TYPES.trust,
      };
      mockCase.contactPrimary.secondaryName = 'Test Petitioner 2';
      const caseTitle = Case.getCaseCaption(mockCase);
      expect(caseTitle).toEqual(
        'Test Petitioner, Test Petitioner 2, Trustee, Petitioner(s)',
      );
    });

    it('party type Corporation', () => {
      const caseTitle = Case.getCaseCaption({
        ...MOCK_CASE,
        partyType: ContactFactory.PARTY_TYPES.corporation,
      });
      expect(caseTitle).toEqual('Test Petitioner, Petitioner');
    });

    it('party type Partnership Tax Matters', () => {
      const mockCase = {
        ...MOCK_CASE,
        partyType: ContactFactory.PARTY_TYPES.partnershipAsTaxMattersPartner,
      };
      mockCase.contactPrimary.secondaryName = 'Test Petitioner 2';
      const caseTitle = Case.getCaseCaption(mockCase);
      expect(caseTitle).toEqual(
        'Test Petitioner, Test Petitioner 2, Tax Matters Partner, Petitioner',
      );
    });

    it('party type Partnership Other Than Tax Matters', () => {
      const mockCase = {
        ...MOCK_CASE,
        partyType: ContactFactory.PARTY_TYPES.partnershipOtherThanTaxMatters,
      };
      mockCase.contactPrimary.secondaryName = 'Test Petitioner 2';
      const caseTitle = Case.getCaseCaption(mockCase);
      expect(caseTitle).toEqual(
        'Test Petitioner, Test Petitioner 2, A Partner Other Than the Tax Matters Partner, Petitioner',
      );
    });

    it('party type Partnership BBA', () => {
      const mockCase = {
        ...MOCK_CASE,
        partyType: ContactFactory.PARTY_TYPES.partnershipBBA,
      };
      mockCase.contactPrimary.secondaryName = 'Test Petitioner 2';
      const caseTitle = Case.getCaseCaption(mockCase);
      expect(caseTitle).toEqual(
        'Test Petitioner, Test Petitioner 2, Partnership Representative, Petitioner(s)',
      );
    });

    it('party type Conservator', () => {
      const mockCase = {
        ...MOCK_CASE,
        partyType: ContactFactory.PARTY_TYPES.conservator,
      };
      mockCase.contactPrimary.secondaryName = 'Test Petitioner 2';
      const caseTitle = Case.getCaseCaption(mockCase);
      expect(caseTitle).toEqual(
        'Test Petitioner, Test Petitioner 2, Conservator, Petitioner',
      );
    });

    it('party type Guardian', () => {
      const mockCase = {
        ...MOCK_CASE,
        partyType: ContactFactory.PARTY_TYPES.guardian,
      };
      mockCase.contactPrimary.secondaryName = 'Test Petitioner 2';
      const caseTitle = Case.getCaseCaption(mockCase);
      expect(caseTitle).toEqual(
        'Test Petitioner, Test Petitioner 2, Guardian, Petitioner',
      );
    });

    it('party type Custodian', () => {
      const mockCase = {
        ...MOCK_CASE,
        partyType: ContactFactory.PARTY_TYPES.custodian,
      };
      mockCase.contactPrimary.secondaryName = 'Test Petitioner 2';
      const caseTitle = Case.getCaseCaption(mockCase);
      expect(caseTitle).toEqual(
        'Test Petitioner, Test Petitioner 2, Custodian, Petitioner',
      );
    });

    it('party type Minor', () => {
      const mockCase = {
        ...MOCK_CASE,
        partyType: ContactFactory.PARTY_TYPES.nextFriendForMinor,
      };
      mockCase.contactPrimary.secondaryName = 'Test Petitioner 2';
      const caseTitle = Case.getCaseCaption(mockCase);
      expect(caseTitle).toEqual(
        'Test Petitioner, Minor, Test Petitioner 2, Next Friend, Petitioner',
      );
    });

    it('party type Legally Incompetent Person', () => {
      const mockCase = {
        ...MOCK_CASE,
        partyType: ContactFactory.PARTY_TYPES.nextFriendForIncompetentPerson,
      };
      mockCase.contactPrimary.secondaryName = 'Test Petitioner 2';
      const caseTitle = Case.getCaseCaption(mockCase);
      expect(caseTitle).toEqual(
        'Test Petitioner, Incompetent, Test Petitioner 2, Next Friend, Petitioner',
      );
    });

    it('party type Donor', () => {
      const caseTitle = Case.getCaseCaption({
        ...MOCK_CASE,
        partyType: ContactFactory.PARTY_TYPES.donor,
      });
      expect(caseTitle).toEqual('Test Petitioner, Donor, Petitioner');
    });

    it('party type Transferee', () => {
      const caseTitle = Case.getCaseCaption({
        ...MOCK_CASE,
        partyType: ContactFactory.PARTY_TYPES.transferee,
      });
      expect(caseTitle).toEqual('Test Petitioner, Transferee, Petitioner');
    });

    it('party type Surviving Spouse', () => {
      const mockCase = {
        ...MOCK_CASE,
        partyType: ContactFactory.PARTY_TYPES.survivingSpouse,
      };
      mockCase.contactPrimary.secondaryName = 'Test Petitioner 2';
      const caseTitle = Case.getCaseCaption(mockCase);
      expect(caseTitle).toEqual(
        'Test Petitioner, Deceased, Test Petitioner 2, Surviving Spouse, Petitioner',
      );
    });
  });

  describe('getCaseCaptionNames', () => {
    it('party type Petitioner', () => {
      const caseCaptionNames = Case.getCaseCaptionNames(
        'Test Petitioner, Petitioner',
      );
      expect(caseCaptionNames).toEqual('Test Petitioner');
    });

    it('party type Petitioner & Spouse', () => {
      const caseCaptionNames = Case.getCaseCaptionNames(
        'Test Petitioner & Test Petitioner 2, Petitioners',
      );
      expect(caseCaptionNames).toEqual('Test Petitioner & Test Petitioner 2');
    });

    it('party type Estate with an Executor/Personal Representative/Fiduciary/etc.', () => {
      const caseCaptionNames = Case.getCaseCaptionNames(
        'Estate of Test Petitioner 2, Deceased, Test Petitioner, Executor, Petitioner(s)',
      );
      expect(caseCaptionNames).toEqual(
        'Estate of Test Petitioner 2, Deceased, Test Petitioner, Executor',
      );
    });
  });

  describe('sendToIRSHoldingQueue', () => {
    it('sets status for irs batch', () => {
      const caseRecord = new Case(MOCK_CASE, {
        applicationContext,
      });
      caseRecord.sendToIRSHoldingQueue();
      expect(caseRecord.status).toEqual(Case.STATUS_TYPES.batchedForIRS);
    });
  });

  describe('markAsPaidByPayGov', () => {
    it('sets pay gov fields', () => {
      const caseRecord = new Case(MOCK_CASE, {
        applicationContext,
      });
      caseRecord.markAsPaidByPayGov(new Date().toISOString());
      expect(caseRecord.payGovDate).toBeDefined();
    });

    it('should add item to docket record when paid', () => {
      const caseRecord = new Case(MOCK_CASE, {
        applicationContext,
      });
      const payGovDate = new Date().toISOString();
      const initialDocketLength =
        (caseRecord.docketRecord && caseRecord.docketRecord.length) || 0;
      caseRecord.markAsPaidByPayGov(payGovDate);
      const docketLength = caseRecord.docketRecord.length;
      expect(docketLength).toEqual(initialDocketLength + 1);
    });

    it('should only set docket record once per time paid', () => {
      const caseRecord = new Case(MOCK_CASE, {
        applicationContext,
      });
      caseRecord.markAsPaidByPayGov(new Date().toISOString());
      const docketLength = caseRecord.docketRecord.length;
      caseRecord.markAsPaidByPayGov(new Date().toISOString());
      caseRecord.markAsPaidByPayGov(new Date('2019-01-01').toISOString());
      caseRecord.markAsPaidByPayGov(new Date('2019-01-01').toISOString());
      expect(docketLength).toEqual(caseRecord.docketRecord.length);
    });

    it('should overwrite existing docket record entry if one already exists', () => {
      const caseRecord = new Case(MOCK_CASE, {
        applicationContext,
      });
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
      const caseRecord = new Case(MOCK_CASE, {
        applicationContext,
      });
      const preferredTrialCity = 'Mobile, Alabama';
      const initialDocketLength =
        (caseRecord.docketRecord && caseRecord.docketRecord.length) || 0;
      caseRecord.setRequestForTrialDocketRecord(preferredTrialCity);
      const docketLength = caseRecord.docketRecord.length;
      expect(docketLength).toEqual(initialDocketLength + 1);
    });

    it('should only set docket record once for request for trial', () => {
      const caseRecord = new Case(MOCK_CASE, {
        applicationContext,
      });
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
      const caseRecord = new Case(MOCK_CASE, {
        applicationContext,
      });
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
      const caseRecord = new Case(MOCK_CASE, {
        applicationContext,
      });
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
      const caseRecord = new Case(MOCK_CASE, {
        applicationContext,
      });
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
      const caseRecord = new Case(MOCK_CASE, {
        applicationContext,
      });
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
      const caseRecord = new Case(
        {},
        {
          applicationContext,
        },
      );
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
      const caseRecord = new Case(MOCK_CASE, {
        applicationContext,
      });
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
      const caseToVerify = new Case(
        {},
        {
          applicationContext,
        },
      );
      caseToVerify.attachRespondent(
        new Respondent({
          userId: 'respondent',
        }),
      );
      expect(caseToVerify.respondents).not.toBeNull();
      expect(caseToVerify.respondents[0].userId).toEqual('respondent');
    });
  });

  describe('attachPractitioner', () => {
    it('adds the user to the practitioners', () => {
      const caseToVerify = new Case(
        {},
        {
          applicationContext,
        },
      );
      caseToVerify.attachPractitioner(
        new Practitioner({
          userId: 'practitioner',
        }),
      );
      expect(caseToVerify.practitioners).not.toBeNull();
      expect(caseToVerify.practitioners[0].userId).toEqual('practitioner');
    });
  });

  describe('addDocument', () => {
    it('attaches the document to the case', () => {
      const caseToVerify = new Case(
        {},
        {
          applicationContext,
        },
      );
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
      const filingTypes = Case.getFilingTypes(User.ROLES.petitioner);
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
      const filingTypes = Case.getFilingTypes(User.ROLES.practitioner);
      expect(filingTypes).not.toBeNull();
      expect(filingTypes.length).toEqual(4);
      expect(filingTypes[0]).toEqual('Individual petitioner');
    });
  });

  describe('updateDocketNumberRecord records suffix changes', () => {
    it('should create a docket record when the suffix updates', () => {
      const caseToVerify = new Case(
        { docketNumber: '123-19' },
        {
          applicationContext,
        },
      );
      expect(caseToVerify.initialDocketNumberSuffix).toEqual('_');
      caseToVerify.docketNumberSuffix = 'W';
      caseToVerify.updateDocketNumberRecord();
      expect(caseToVerify.docketRecord.length).toEqual(1);
    });

    it('should not create a docket record if suffix has not changed', () => {
      const caseToVerify = new Case(
        { docketNumber: '123-19' },
        {
          applicationContext,
        },
      );
      expect(caseToVerify.initialDocketNumberSuffix).toEqual('_');
      caseToVerify.updateDocketNumberRecord();
      expect(caseToVerify.docketRecord.length).toEqual(0);
    });

    it('should add to the docket record when the docket number changes from the last updated docket number', () => {
      const caseToVerify = new Case(
        {
          caseCaption: 'A Very Berry New Caption',
          docketNumber: '123-19',
          docketRecord: [
            {
              description:
                "Docket Number is amended from '123-19A' to '123-19B'",
            },
            {
              description:
                "Docket Number is amended from '123-19B' to '123-19P'",
            },
          ],
        },
        {
          applicationContext,
        },
      );
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
      const caseToVerify = new Case(
        {},
        {
          applicationContext,
        },
      ).updateCaseTitleDocketRecord();
      expect(caseToVerify.docketRecord.length).toEqual(0);
    });

    it('should not add to the docket record when the caption is initially being set', () => {
      const caseToVerify = new Case(
        {
          caseCaption: 'Caption',
        },
        {
          applicationContext,
        },
      ).updateCaseTitleDocketRecord();
      expect(caseToVerify.docketRecord.length).toEqual(0);
    });

    it('should not add to the docket record when the caption is equivalent to the initial title', () => {
      const caseToVerify = new Case(
        {
          caseCaption: 'Caption',
          initialTitle:
            'Caption v. Commissioner of Internal Revenue, Respondent',
        },
        {
          applicationContext,
        },
      ).updateCaseTitleDocketRecord();
      expect(caseToVerify.docketRecord.length).toEqual(0);
    });

    it('should add to the docket record when the caption changes from the initial title', () => {
      const caseToVerify = new Case(
        {
          caseCaption: 'A New Caption',
          initialTitle:
            'Caption v. Commissioner of Internal Revenue, Respondent',
        },
        {
          applicationContext,
        },
      ).updateCaseTitleDocketRecord();
      expect(caseToVerify.docketRecord.length).toEqual(1);
    });

    it('should not add to the docket record when the caption is equivalent to the last updated title', () => {
      const caseToVerify = new Case(
        {
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
          initialTitle:
            'Caption v. Commissioner of Internal Revenue, Respondent',
        },
        {
          applicationContext,
        },
      ).updateCaseTitleDocketRecord();
      expect(caseToVerify.docketRecord.length).toEqual(2);
    });

    it('should add to the docket record when the caption changes from the last updated title', () => {
      const caseToVerify = new Case(
        {
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
          initialTitle:
            'Caption v. Commissioner of Internal Revenue, Respondent',
        },
        {
          applicationContext,
        },
      ).updateCaseTitleDocketRecord();
      expect(caseToVerify.docketRecord.length).toEqual(3);
    });
  });

  describe('getWorkItems', () => {
    it('should get all the work items associated with the documents in the case', () => {
      const myCase = new Case(MOCK_CASE, {
        applicationContext,
      });
      myCase.addDocument({
        documentId: '123',
        documentType: 'Answer',
        userId: 'respondent',
      });
      const workItem = new WorkItem(
        {
          assigneeId: 'bob',
          assigneeName: 'bob',
          caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
          caseStatus: Case.STATUS_TYPES.new,
          caseTitle: 'testing',
          docketNumber: '101-18',
          document: {},
          isQC: true,
          sentBy: 'bob',
        },
        { applicationContext },
      );
      myCase.documents[0].addWorkItem(workItem);
      const workItems = myCase.getWorkItems();
      expect(workItems.length).toEqual(1);
      expect(workItems).toMatchObject([
        {
          assigneeId: 'bob',
          assigneeName: 'bob',
          caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
          caseStatus: Case.STATUS_TYPES.new,
          caseTitle: 'testing',
          docketNumber: '101-18',
          document: {},
          isQC: true,
          sentBy: 'bob',
        },
      ]);
    });
  });

  describe('checkForReadyForTrial', () => {
    it('should not change the status if no answer documents have been filed', () => {
      const caseToCheck = new Case(
        {
          documents: [],
          status: Case.STATUS_TYPES.generalDocket,
        },
        {
          applicationContext,
        },
      ).checkForReadyForTrial();
      expect(caseToCheck.status).toEqual(Case.STATUS_TYPES.generalDocket);
    });

    it('should not change the status if an answer document has been filed, but the cutoff has not elapsed', () => {
      const caseToCheck = new Case(
        {
          documents: [
            {
              createdAt: moment().toISOString(),
              eventCode: 'A',
            },
          ],
          status: Case.STATUS_TYPES.generalDocket,
        },
        {
          applicationContext,
        },
      ).checkForReadyForTrial();
      expect(caseToCheck.status).toEqual(Case.STATUS_TYPES.generalDocket);
    });

    it('should not change the status if a non answer document has been filed before the cutoff', () => {
      const caseToCheck = new Case(
        {
          documents: [
            {
              createdAt: moment()
                .subtract(1, 'year')
                .toISOString(),
              eventCode: 'ZZZs',
            },
          ],
          status: Case.STATUS_TYPES.generalDocket,
        },
        {
          applicationContext,
        },
      ).checkForReadyForTrial();
      expect(caseToCheck.status).toEqual(Case.STATUS_TYPES.generalDocket);
    });

    it("should not change the status to 'Ready for Trial' when an answer document has been filed on the cutoff", () => {
      const caseToCheck = new Case(
        {
          documents: [
            {
              createdAt: moment()
                .subtract(Case.ANSWER_CUTOFF_AMOUNT, Case.ANSWER_CUTOFF_UNIT)
                .toISOString(),
              eventCode: 'A',
            },
          ],
          status: Case.STATUS_TYPES.generalDocket,
        },
        {
          applicationContext,
        },
      ).checkForReadyForTrial();

      expect(caseToCheck.status).not.toEqual(
        Case.STATUS_TYPES.generalDocketReadyForTrial,
      );
    });

    it("should not change the status to 'Ready for Trial' when an answer document has been filed before the cutoff but case is not 'Not at issue'", () => {
      const createdAt = moment()
        .subtract(Case.ANSWER_CUTOFF_AMOUNT + 10, Case.ANSWER_CUTOFF_UNIT)
        .toISOString();

      const caseToCheck = new Case(
        {
          documents: [
            {
              createdAt,
              eventCode: 'A',
            },
          ],
          status: Case.STATUS_TYPES.new,
        },
        {
          applicationContext,
        },
      ).checkForReadyForTrial();

      expect(caseToCheck.status).toEqual(Case.STATUS_TYPES.new);
    });

    it("should change the status to 'Ready for Trial' when an answer document has been filed before the cutoff", () => {
      const createdAt = moment()
        .subtract(Case.ANSWER_CUTOFF_AMOUNT + 10, Case.ANSWER_CUTOFF_UNIT)
        .toISOString();

      const caseToCheck = new Case(
        {
          documents: [
            {
              createdAt,
              eventCode: 'A',
            },
          ],
          status: Case.STATUS_TYPES.generalDocket,
        },
        {
          applicationContext,
        },
      ).checkForReadyForTrial();

      expect(caseToCheck.status).toEqual(
        Case.STATUS_TYPES.generalDocketReadyForTrial,
      );
    });
  });

  describe('generateTrialSortTags', () => {
    it('should generate sort tags for a regular case', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
          receivedAt: '2018-12-12T05:00:00Z',
        },
        {
          applicationContext,
        },
      );
      expect(myCase.generateTrialSortTags()).toEqual({
        hybrid:
          'WashingtonDC-H-D-20181212000000-c54ba5a9-b37b-479d-9201-067ec6e335bb',
        nonHybrid:
          'WashingtonDC-R-D-20181212000000-c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
    });

    it('should generate sort tags for a small case', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
          procedureType: 'Small',
          receivedAt: '2018-12-12T05:00:00Z',
        },
        {
          applicationContext,
        },
      );
      expect(myCase.generateTrialSortTags()).toEqual({
        hybrid:
          'WashingtonDC-H-D-20181212000000-c54ba5a9-b37b-479d-9201-067ec6e335bb',
        nonHybrid:
          'WashingtonDC-S-D-20181212000000-c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
    });

    it('should generate sort tags for a prioritized P case', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
          caseType: 'passport',
          receivedAt: '2018-12-12T05:00:00Z',
        },
        {
          applicationContext,
        },
      );
      expect(myCase.generateTrialSortTags()).toEqual({
        hybrid:
          'WashingtonDC-H-C-20181212000000-c54ba5a9-b37b-479d-9201-067ec6e335bb',
        nonHybrid:
          'WashingtonDC-R-C-20181212000000-c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
    });

    it('should generate sort tags for a prioritized L case', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
          caseType: 'cdp (lien/levy)',
          receivedAt: '2018-12-12T05:00:00Z',
        },
        {
          applicationContext,
        },
      );
      expect(myCase.generateTrialSortTags()).toEqual({
        hybrid:
          'WashingtonDC-H-B-20181212000000-c54ba5a9-b37b-479d-9201-067ec6e335bb',
        nonHybrid:
          'WashingtonDC-R-B-20181212000000-c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
    });

    it('should generate sort tags for a prioritized high priority case', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
          highPriority: true,
          procedureType: 'Small',
          receivedAt: '2018-12-12T05:00:00Z',
        },
        {
          applicationContext,
        },
      );
      expect(myCase.generateTrialSortTags()).toEqual({
        hybrid:
          'WashingtonDC-H-A-20181212000000-c54ba5a9-b37b-479d-9201-067ec6e335bb',
        nonHybrid:
          'WashingtonDC-S-A-20181212000000-c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
    });
  });

  describe('setAsCalendared', () => {
    it('should set case as calendared with only judge and trialSessionId if the trial session is calendared', () => {
      const myCase = new Case(MOCK_CASE, {
        applicationContext,
      });
      myCase.setAsCalendared({
        isCalendared: true,
        judge: {
          name: 'Judge Judy',
        },
        trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
      expect(myCase.trialSessionId).toBeTruthy();
      expect(myCase.status).toEqual(Case.STATUS_TYPES.calendared);
    });

    it('should set case as calendared with all trial session fields if the trial session is calendared', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
        },
        {
          applicationContext,
        },
      );
      const trialSession = new TrialSession(
        {
          isCalendared: true,
          judge: { name: 'Judge Buch' },
          maxCases: 100,
          sessionType: 'Regular',
          startDate: '2025-03-01T00:00:00.000Z',
          term: 'Fall',
          termYear: '2025',
          trialLocation: 'Birmingham, AL',
        },
        { applicationContext },
      );
      myCase.setAsCalendared(trialSession);

      expect(myCase.status).toEqual(Case.STATUS_TYPES.calendared);
      expect(myCase.trialDate).toBeTruthy();
      expect(myCase.associatedJudge).toBeTruthy();
      expect(myCase.trialLocation).toBeTruthy();
      expect(myCase.trialSessionId).toBeTruthy();
      expect(myCase.trialTime).toBeTruthy();
    });

    it('should set all trial session fields but not set the case as calendared if the trial session is not calendared', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
        },
        {
          applicationContext,
        },
      );
      const trialSession = new TrialSession(
        {
          isCalendared: false,
          judge: { name: 'Judge Buch' },
          maxCases: 100,
          sessionType: 'Regular',
          startDate: '2025-03-01T00:00:00.000Z',
          term: 'Fall',
          termYear: '2025',
          trialLocation: 'Birmingham, AL',
        },
        { applicationContext },
      );
      myCase.setAsCalendared(trialSession);

      expect(myCase.status).toEqual(Case.STATUS_TYPES.new);
      expect(myCase.trialDate).toBeTruthy();
      expect(myCase.associatedJudge).toBeTruthy();
      expect(myCase.trialLocation).toBeTruthy();
      expect(myCase.trialSessionId).toBeTruthy();
      expect(myCase.trialTime).toBeTruthy();
    });
  });

  describe('closeCase', () => {
    it('should update the status of the case to closed', () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
          blocked: true,
          blockedDate: '2019-03-01T21:40:46.415Z',
          blockedReason: 'something else',
          highPriority: true,
          highPriorityReason: 'something',
        },
        {
          applicationContext,
        },
      );
      myCase.closeCase();
      expect(myCase).toMatchObject({
        blocked: false,
        blockedDate: undefined,
        blockedReason: undefined,
        highPriority: false,
        highPriorityReason: undefined,
        status: Case.STATUS_TYPES.closed,
      });
    });
  });

  describe('recallFromIRSHoldingQueue', () => {
    it('should update the status of the case to recalled', () => {
      const myCase = new Case(MOCK_CASE, {
        applicationContext,
      });
      myCase.recallFromIRSHoldingQueue();
      expect(myCase.status).toEqual(Case.STATUS_TYPES.recalled);
    });
  });

  describe('getDocumentById', () => {
    it('should get the document by an Id', () => {
      const myCase = new Case(MOCK_CASE, {
        applicationContext,
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

  describe('addDocumentWithoutDocketRecord', () => {
    it('should add the document without a docket record change', () => {
      const myCase = new Case(MOCK_CASE, {
        applicationContext,
      });
      const docketRecordLength = myCase.docketRecord.length;
      myCase.addDocumentWithoutDocketRecord({
        documentId: 'mock-document-id',
      });
      expect(myCase.docketRecord.length).toEqual(docketRecordLength);
    });
  });

  describe('updateDocument', () => {
    it('should update the document', () => {
      const myCase = new Case(MOCK_CASE, {
        applicationContext,
      });
      myCase.updateDocument({
        documentId: MOCK_DOCUMENTS[0].documentId,
        processingStatus: 'success',
      });
      expect(myCase.documents[0].processingStatus).toEqual('success');
    });
  });

  describe('updatePractitioner', () => {
    it('updates the given practioner on the case', () => {
      const caseToVerify = new Case(
        {
          practitioners: [
            new Practitioner({
              representingPrimary: true,
              userId: 'practitioner',
            }),
          ],
        },
        {
          applicationContext,
        },
      );

      expect(caseToVerify.practitioners).not.toBeNull();
      expect(caseToVerify.practitioners[0].representingPrimary).toBeTruthy();

      caseToVerify.updatePractitioner({
        representingPrimary: false,
        userId: 'practitioner',
      });
      expect(caseToVerify.practitioners[0].representingPrimary).toBeFalsy();
    });
  });

  describe('removePractitioner', () => {
    it('removes the user from associated case practitioners array', () => {
      const caseToVerify = new Case(
        {
          practitioners: [
            new Practitioner({ userId: 'practitioner1' }),
            new Practitioner({ userId: 'practitioner2' }),
            new Practitioner({ userId: 'practitioner3' }),
          ],
        },
        {
          applicationContext,
        },
      );

      expect(caseToVerify.practitioners).not.toBeNull();
      expect(caseToVerify.practitioners.length).toEqual(3);

      caseToVerify.removePractitioner({ userId: 'practitioner2' });
      expect(caseToVerify.practitioners.length).toEqual(2);
      expect(
        caseToVerify.practitioners.find(
          practitioner => practitioner.userId === 'practitioner2',
        ),
      ).toBeFalsy();
    });
  });

  describe('updateRespondent', () => {
    it('updates the given respondent on the case', () => {
      const caseToVerify = new Case(
        {
          respondents: [
            new Practitioner({
              email: 'rspndnt',
              userId: 'respondent',
            }),
          ],
        },
        {
          applicationContext,
        },
      );

      expect(caseToVerify.respondents).not.toBeNull();
      expect(caseToVerify.respondents[0].email).toEqual('rspndnt');

      caseToVerify.updateRespondent({
        email: 'respondent@example.com',
        userId: 'respondent',
      });
      expect(caseToVerify.respondents[0].email).toEqual(
        'respondent@example.com',
      );
    });
  });

  describe('removeRespondent', () => {
    it('removes the user from associated case respondents array', () => {
      const caseToVerify = new Case(
        {
          respondents: [
            new Respondent({ userId: 'respondent1' }),
            new Respondent({ userId: 'respondent2' }),
            new Respondent({ userId: 'respondent3' }),
          ],
        },
        {
          applicationContext,
        },
      );

      expect(caseToVerify.respondents).not.toBeNull();
      expect(caseToVerify.respondents.length).toEqual(3);

      caseToVerify.removeRespondent({ userId: 'respondent2' });
      expect(caseToVerify.respondents.length).toEqual(2);
      expect(
        caseToVerify.respondents.find(
          respondent => respondent.userId === 'respondent2',
        ),
      ).toBeFalsy();
    });
  });

  describe('setAsBlocked', () => {
    it('sets the case as blocked with a blocked reason', () => {
      const caseToUpdate = new Case(
        {
          ...MOCK_CASE,
        },
        {
          applicationContext,
        },
      );

      expect(caseToUpdate.blocked).toBeFalsy();

      caseToUpdate.setAsBlocked('because reasons');

      expect(caseToUpdate.blocked).toEqual(true);
      expect(caseToUpdate.blockedReason).toEqual('because reasons');
      expect(caseToUpdate.blockedDate).toBeDefined();
    });
  });

  describe('unsetAsBlocked', () => {
    it('unsets the case as blocked', () => {
      const caseToUpdate = new Case(
        {
          ...MOCK_CASE,
          blocked: true,
          blockedReason: 'because reasons',
        },
        {
          applicationContext,
        },
      );

      expect(caseToUpdate.blocked).toBeTruthy();

      caseToUpdate.unsetAsBlocked();

      expect(caseToUpdate.blocked).toBeFalsy();
      expect(caseToUpdate.blockedReason).toBeUndefined();
      expect(caseToUpdate.blockedDate).toBeUndefined();
    });
  });

  describe('setAsHighPriority', () => {
    it('sets the case as high priority with a high priority reason', () => {
      const caseToUpdate = new Case(
        {
          ...MOCK_CASE,
        },
        {
          applicationContext,
        },
      );

      expect(caseToUpdate.highPriority).toBeFalsy();

      caseToUpdate.setAsHighPriority('because reasons');

      expect(caseToUpdate.highPriority).toEqual(true);
      expect(caseToUpdate.highPriorityReason).toEqual('because reasons');
    });
  });

  describe('unsetAsHighPriority', () => {
    it('unsets the case as high priority', () => {
      const caseToUpdate = new Case(
        {
          ...MOCK_CASE,
          highPriority: true,
          highPriorityReason: 'because reasons',
        },
        {
          applicationContext,
        },
      );

      expect(caseToUpdate.highPriority).toBeTruthy();

      caseToUpdate.unsetAsHighPriority();

      expect(caseToUpdate.highPriority).toBeFalsy();
      expect(caseToUpdate.highPriorityReason).toBeUndefined();
    });
  });

  describe('removeFromTrial', () => {
    it('removes the case from trial, unsetting trial details and setting status to general docket ready for trial', () => {
      const caseToUpdate = new Case(
        {
          ...MOCK_CASE,
        },
        {
          applicationContext,
        },
      );
      const trialSession = new TrialSession(
        {
          isCalendared: true,
          judge: { name: 'Judge Buch' },
          maxCases: 100,
          sessionType: 'Regular',
          startDate: '2025-03-01T00:00:00.000Z',
          term: 'Fall',
          termYear: '2025',
          trialLocation: 'Birmingham, AL',
        },
        { applicationContext },
      );
      caseToUpdate.setAsCalendared(trialSession);

      expect(caseToUpdate.status).toEqual(Case.STATUS_TYPES.calendared);
      expect(caseToUpdate.trialDate).toBeTruthy();
      expect(caseToUpdate.associatedJudge).toEqual('Judge Buch');
      expect(caseToUpdate.trialLocation).toBeTruthy();
      expect(caseToUpdate.trialSessionId).toBeTruthy();
      expect(caseToUpdate.trialTime).toBeTruthy();

      caseToUpdate.removeFromTrial();

      expect(caseToUpdate.status).toEqual(
        Case.STATUS_TYPES.generalDocketReadyForTrial,
      );
      expect(caseToUpdate.trialDate).toBeFalsy();
      expect(caseToUpdate.associatedJudge).toEqual(Case.CHIEF_JUDGE);
      expect(caseToUpdate.trialLocation).toBeFalsy();
      expect(caseToUpdate.trialSessionId).toBeFalsy();
      expect(caseToUpdate.trialTime).toBeFalsy();
    });
  });

  describe('removeFromTrialWithAssociatedJudge', () => {
    it('removes the case from trial, updating the associated judge if one is passed in', () => {
      const caseToUpdate = new Case(
        {
          ...MOCK_CASE,
        },
        {
          applicationContext,
        },
      );
      const trialSession = new TrialSession(
        {
          isCalendared: true,
          judge: { name: 'Judge Buch' },
          maxCases: 100,
          sessionType: 'Regular',
          startDate: '2025-03-01T00:00:00.000Z',
          term: 'Fall',
          termYear: '2025',
          trialLocation: 'Birmingham, AL',
        },
        { applicationContext },
      );
      caseToUpdate.setAsCalendared(trialSession);

      expect(caseToUpdate.status).toEqual(Case.STATUS_TYPES.calendared);
      expect(caseToUpdate.trialDate).toBeTruthy();
      expect(caseToUpdate.associatedJudge).toEqual('Judge Buch');
      expect(caseToUpdate.trialLocation).toBeTruthy();
      expect(caseToUpdate.trialSessionId).toBeTruthy();
      expect(caseToUpdate.trialTime).toBeTruthy();

      caseToUpdate.removeFromTrialWithAssociatedJudge('Judge Armen');

      expect(caseToUpdate.associatedJudge).toEqual('Judge Armen');
      expect(caseToUpdate.trialDate).toBeFalsy();
      expect(caseToUpdate.trialLocation).toBeFalsy();
      expect(caseToUpdate.trialSessionId).toBeFalsy();
      expect(caseToUpdate.trialTime).toBeFalsy();
    });

    it('removes the case from trial, leaving the associated judge unchanged if one is not passed in', () => {
      const caseToUpdate = new Case(
        {
          ...MOCK_CASE,
        },
        {
          applicationContext,
        },
      );
      const trialSession = new TrialSession(
        {
          isCalendared: true,
          judge: { name: 'Judge Buch' },
          maxCases: 100,
          sessionType: 'Regular',
          startDate: '2025-03-01T00:00:00.000Z',
          term: 'Fall',
          termYear: '2025',
          trialLocation: 'Birmingham, AL',
        },
        { applicationContext },
      );
      caseToUpdate.setAsCalendared(trialSession);

      expect(caseToUpdate.status).toEqual(Case.STATUS_TYPES.calendared);
      expect(caseToUpdate.trialDate).toBeTruthy();
      expect(caseToUpdate.associatedJudge).toEqual('Judge Buch');
      expect(caseToUpdate.trialLocation).toBeTruthy();
      expect(caseToUpdate.trialSessionId).toBeTruthy();
      expect(caseToUpdate.trialTime).toBeTruthy();

      caseToUpdate.removeFromTrialWithAssociatedJudge();

      expect(caseToUpdate.associatedJudge).toEqual('Judge Buch');
      expect(caseToUpdate.trialDate).toBeFalsy();
      expect(caseToUpdate.trialLocation).toBeFalsy();
      expect(caseToUpdate.trialSessionId).toBeFalsy();
      expect(caseToUpdate.trialTime).toBeFalsy();
    });
  });

  describe('hasPendingItems', () => {
    it('should not show the case as having pending items if no documents are pending', () => {
      const caseToUpdate = new Case(
        {
          ...MOCK_CASE_WITHOUT_PENDING,
        },
        {
          applicationContext,
        },
      );

      expect(caseToUpdate.hasPendingItems).toEqual(false);
      expect(caseToUpdate.doesHavePendingItems()).toEqual(false);
    });
    it('should show the case as having pending items if some documents are pending', () => {
      const mockCase = {
        ...MOCK_CASE,
      };
      mockCase.documents[0].pending = true;

      const caseToUpdate = new Case(mockCase, {
        applicationContext,
      });

      expect(caseToUpdate.hasPendingItems).toEqual(true);
      expect(caseToUpdate.doesHavePendingItems()).toEqual(true);
    });
  });

  describe('setCaseStatus', () => {
    it('should update the case status and set the associated judge to the chief judge if the new status is General Docket - Not At Issue', () => {
      const updatedCase = new Case(
        {
          ...MOCK_CASE,
          associatedJudge: 'Judge Buch',
        },
        {
          applicationContext,
        },
      );

      updatedCase.setCaseStatus(Case.STATUS_TYPES.generalDocket);

      expect(updatedCase.status).toEqual(Case.STATUS_TYPES.generalDocket);
      expect(updatedCase.associatedJudge).toEqual(Case.CHIEF_JUDGE);
    });

    it('should update the case status and leave the associated judge unchanged if the new status is Closed', () => {
      const updatedCase = new Case(
        {
          ...MOCK_CASE,
          associatedJudge: 'Judge Buch',
        },
        {
          applicationContext,
        },
      );

      updatedCase.setCaseStatus(Case.STATUS_TYPES.closed);

      expect(updatedCase.status).toEqual(Case.STATUS_TYPES.closed);
      expect(updatedCase.associatedJudge).toEqual('Judge Buch');
    });
  });

  describe('setCaseCaption', () => {
    it('should set the case caption and update the case title', () => {
      const updatedCase = new Case(
        {
          ...MOCK_CASE,
        },
        {
          applicationContext,
        },
      );

      updatedCase.setCaseCaption('A whole new caption');

      expect(updatedCase.caseCaption).toEqual('A whole new caption');
      expect(updatedCase.caseTitle).toEqual(
        'A whole new caption v. Commissioner of Internal Revenue, Respondent',
      );
    });
  });

  describe('getCaseContacts', () => {
    const contactPrimary = {
      name: 'Test Petitioner',
      title: 'Executor',
    };

    const contactSecondary = { name: 'Contact Secondary' };

    const practitioners = [
      {
        name: 'Petitioner One',
      },
    ];

    const respondents = [
      {
        name: 'Respondent One',
      },
    ];

    it('should return an object containing all contact types', () => {
      const testCase = new Case(
        {
          ...MOCK_CASE,
          contactPrimary,
          contactSecondary,
          practitioners,
          respondents,
        },
        {
          applicationContext,
        },
      );

      const caseContacts = testCase.getCaseContacts();
      expect(caseContacts).toMatchObject({
        contactPrimary,
        contactSecondary,
        practitioners,
        respondents,
      });
    });

    it('should return an object contacts matching the `shape` if provided', () => {
      const testCase = new Case(
        {
          ...MOCK_CASE,
          contactPrimary,
          contactSecondary,
          practitioners,
          respondents,
        },
        {
          applicationContext,
        },
      );

      const caseContacts = testCase.getCaseContacts({
        contactPrimary: true,
        contactSecondary: true,
      });
      expect(caseContacts).toMatchObject({
        contactPrimary,
        contactSecondary,
      });
    });
  });

  describe('Case Consolidation Eligibility', () => {
    describe('canConsolidate', () => {
      let caseEntity;

      beforeEach(() => {
        caseEntity = new Case(
          { ...MOCK_CASE, status: 'Submitted' },
          {
            applicationContext,
          },
        );
      });

      it('should fail when the pending case status is ineligible', () => {
        caseEntity.status = 'New';
        const result = caseEntity.canConsolidate();

        expect(result).toEqual(false);
      });

      it('should pass when a case has an eligible case status', () => {
        const result = caseEntity.canConsolidate();

        expect(result).toEqual(true);
      });
    });

    describe('getConsolidationStatus', () => {
      let trialSessionEntity;
      let pendingTrialSessionEntity;
      let leadCaseEntity;
      let pendingCaseEntity;

      beforeEach(() => {
        trialSessionEntity = new TrialSession(
          {
            judge: { name: 'Guy Fieri', userId: 'abc-123' },
            trialLocation: 'Flavortown, TN',
          },
          { applicationContext },
        );

        pendingTrialSessionEntity = new TrialSession(
          {
            judge: { name: 'Guy Fieri', userId: 'abc-123' },
            trialLocation: 'Flavortown, TN',
          },
          { applicationContext },
        );

        leadCaseEntity = new Case(
          {
            ...MOCK_CASE,
            procedureType: 'regular',
            status: 'Submitted',
          },
          { applicationContext },
        );

        pendingCaseEntity = new Case(
          {
            ...MOCK_CASE,
            procedureType: 'regular',
            status: 'Submitted',
          },
          { applicationContext },
        );
      });

      it('should fail when case statuses are not the same', () => {
        pendingCaseEntity.status = 'New';

        const result = leadCaseEntity.getConsolidationStatus({
          caseEntity: pendingCaseEntity,
          pendingTrialSessionEntity,
          trialSessionEntity,
        });

        expect(result.canConsolidate).toEqual(false);
        expect(result.reason).toEqual('Case status is not the same.');
      });

      it('should fail when case procedures are not the same', () => {
        pendingCaseEntity.procedureType = 'small';

        const result = leadCaseEntity.getConsolidationStatus({
          caseEntity: pendingCaseEntity,
          pendingTrialSessionEntity,
          trialSessionEntity,
        });

        expect(result.canConsolidate).toEqual(false);
        expect(result.reason).toEqual('Case procedure is not the same.');
      });

      it('should fail when case trial locations are not the same', () => {
        pendingTrialSessionEntity.trialLocation = 'Flavortown, AR';

        const result = leadCaseEntity.getConsolidationStatus({
          caseEntity: pendingCaseEntity,
          pendingTrialSessionEntity,
          trialSessionEntity,
        });

        expect(result.canConsolidate).toEqual(false);
        expect(result.reason).toEqual('Place of trial is not the same.');
      });

      it('should fail when case judges are not the same', () => {
        pendingTrialSessionEntity.judge = 'Smashmouth';

        const result = leadCaseEntity.getConsolidationStatus({
          caseEntity: pendingCaseEntity,
          pendingTrialSessionEntity,
          trialSessionEntity,
        });

        expect(result.canConsolidate).toEqual(false);
        expect(result.reason).toEqual('Judge is not the same.');
      });

      it('should fail when case statuses are both ineligible', () => {
        leadCaseEntity.status = 'Closed';
        pendingCaseEntity.status = 'Closed';

        const result = leadCaseEntity.getConsolidationStatus({
          caseEntity: pendingCaseEntity,
          pendingTrialSessionEntity,
          trialSessionEntity,
        });

        expect(result.canConsolidate).toEqual(false);
        expect(result.reason).toEqual(
          'Case status is Closed and cannot be consolidated.',
        );
      });

      it('should pass when both cases are eligible for consolidation', () => {
        const result = leadCaseEntity.getConsolidationStatus({
          caseEntity: pendingCaseEntity,
          pendingTrialSessionEntity,
          trialSessionEntity,
        });

        expect(result.canConsolidate).toEqual(true);
        expect(result.reason).toEqual('');
      });
    });

    describe('setLeadCase', () => {
      it('Should set the leadCaseId on the given case', async () => {
        const leadCaseId = 'd64ba5a9-b37b-479d-9201-067ec6e335cc';
        const caseEntity = new Case(
          {
            ...MOCK_CASE,
            preferredTrialCity: 'Birmingham, AL',
            procedureType: 'regular',
            status: 'Submitted',
          },
          { applicationContext },
        );
        const result = caseEntity.setLeadCase(leadCaseId);

        expect(result.leadCaseId).toEqual(leadCaseId);
      });
    });
  });
});
