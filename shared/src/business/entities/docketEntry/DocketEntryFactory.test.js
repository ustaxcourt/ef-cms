const {
  calculateISODate,
  createISODateString,
} = require('../../utilities/DateHandler');
const {
  over1000Characters,
} = require('../../test/createTestApplicationContext');
const { DocketEntryFactory } = require('./DocketEntryFactory');
const { OBJECTIONS_OPTIONS_MAP } = require('../EntityConstants');

const { VALIDATION_ERROR_MESSAGES } = DocketEntryFactory;

describe('DocketEntryFactory', () => {
  let rawEntity;
  const errors = () =>
    DocketEntryFactory(rawEntity).getFormattedValidationErrors();

  beforeEach(() => {
    rawEntity = {
      filers: [],
    };
  });

  it('should require a file if isDocumentRequired', () => {
    rawEntity.isDocumentRequired = true;
    expect(errors().primaryDocumentFile).toBeDefined();
  });

  it('should require a file', () => {
    rawEntity.primaryDocumentFile = {};
    rawEntity.primaryDocumentFileSize = 1;
    expect(errors().primaryDocumentFile).toEqual(undefined);
  });

  it('should return an error when an empty document is attached', () => {
    rawEntity.primaryDocumentFile = {};
    rawEntity.primaryDocumentFileSize = 0;
    expect(errors().primaryDocumentFile).toEqual(undefined);
    expect(errors().primaryDocumentFileSize).toEqual(
      VALIDATION_ERROR_MESSAGES.primaryDocumentFileSize[1],
    );
  });

  it('should not require a filing status selection', () => {
    expect(errors().lodged).toEqual(undefined);
  });

  it('should require received date be entered', () => {
    expect(errors().dateReceived).toEqual(
      VALIDATION_ERROR_MESSAGES.dateReceived[1],
    );
    rawEntity.dateReceived = createISODateString();
    expect(errors().dateReceived).toEqual(undefined);
  });

  it('should not allow received date be in the future', () => {
    rawEntity.dateReceived = calculateISODate({ howMuch: 1, unit: 'days' });
    expect(errors().dateReceived).toEqual(
      VALIDATION_ERROR_MESSAGES.dateReceived[0].message,
    );
  });

  it('should be invalid when additionalInfo is over 500 characters long', () => {
    rawEntity.additionalInfo = over1000Characters;

    expect(errors().additionalInfo).toEqual(
      VALIDATION_ERROR_MESSAGES.additionalInfo[0].message,
    );
  });

  it('should be invalid when additionalInfo2 is over 500 characters long', () => {
    rawEntity.additionalInfo2 = over1000Characters;

    expect(errors().additionalInfo2).toEqual(
      VALIDATION_ERROR_MESSAGES.additionalInfo2[0].message,
    );
  });

  it('should require event code', () => {
    expect(errors().eventCode).toBeDefined();
  });

  it('should require objections when eventCode is ADMT and previopus document is an objection document type', () => {
    rawEntity.eventCode = 'ADMT';
    rawEntity.previousDocument = {
      documentType: 'Application to Take Deposition',
    };
    expect(errors().objections).toBeDefined();
  });

  it('should require objections when eventCode is AMAT and previopus document is an objection document type', () => {
    rawEntity.eventCode = 'AMAT';
    rawEntity.previousDocument = {
      documentType: 'Application to Take Deposition',
    };
    expect(errors().objections).toBeDefined();
  });

  it('should require objections when document is an objection document type', () => {
    rawEntity.documentType = 'Application to Take Deposition';
    expect(errors().objections).toBeDefined();
  });

  describe('Document type', () => {
    beforeEach(() => {
      rawEntity = {
        ...rawEntity,
        category: 'Answer',
        documentTitle: '[First, Second, etc.] Amendment to Answer',
        documentType: 'Amendment to Answer',
        scenario: 'Nonstandard G',
      };
    });

    it('should require non standard fields', () => {
      expect(errors().ordinalValue).toEqual(
        VALIDATION_ERROR_MESSAGES.ordinalValue,
      );
      rawEntity.ordinalValue = 'First';
      expect(errors().ordinalValue).toEqual(undefined);
    });
  });

  it('should not require Additional info 1', () => {
    expect(errors().additionalInfo).toEqual(undefined);
  });

  it('should not require Additional info 2', () => {
    expect(errors().additionalInfo2).toEqual(undefined);
  });

  it('should not require add to cover sheet', () => {
    expect(errors().addToCoversheet).toEqual(undefined);
  });

  describe('Inclusions', () => {
    it('should not require Certificate of Service', () => {
      expect(errors().certificateOfService).toEqual(undefined);
    });

    describe('Has Certificate of Service', () => {
      beforeEach(() => {
        rawEntity.certificateOfService = true;
      });

      it('should require certificate of service date be entered', () => {
        expect(errors().certificateOfServiceDate).toEqual(
          VALIDATION_ERROR_MESSAGES.certificateOfServiceDate[1],
        );
        rawEntity.certificateOfServiceDate = createISODateString();
        expect(errors().certificateOfServiceDate).toEqual(undefined);
      });

      it('should not allow certificate of service date be in the future', () => {
        rawEntity.certificateOfServiceDate = calculateISODate({
          howMuch: 1,
          unit: 'days',
        });
        expect(errors().certificateOfServiceDate).toEqual(
          VALIDATION_ERROR_MESSAGES.certificateOfServiceDate[0].message,
        );
      });
    });

    it('should not require Attachments', () => {
      expect(errors().attachments).toEqual(undefined);
    });

    it('should not require Objections', () => {
      expect(errors().objections).toEqual(undefined);
    });

    describe('Motion Document', () => {
      beforeEach(() => {
        rawEntity.category = 'Motion';
        rawEntity.documentType = 'Motion for Continuance';
      });

      it('should require Objections', () => {
        expect(errors().objections).toEqual(
          VALIDATION_ERROR_MESSAGES.objections,
        );
        rawEntity.objections = OBJECTIONS_OPTIONS_MAP.NO;
        expect(errors().objections).toEqual(undefined);
      });

      it('should require Objections for an Amended document with a Motion previousDocument', () => {
        rawEntity.category = 'Miscellaneous';
        rawEntity.eventCode = 'AMAT';
        rawEntity.previousDocument = {
          documentType: 'Motion for Continuance',
        };

        expect(errors().objections).toEqual(
          VALIDATION_ERROR_MESSAGES.objections,
        );
        rawEntity.objections = OBJECTIONS_OPTIONS_MAP.NO;
        expect(errors().objections).toEqual(undefined);
      });
    });

    describe('Nonstandard H', () => {
      beforeEach(() => {
        rawEntity.scenario = 'Nonstandard H';
      });

      it('should not require secondary file', () => {
        expect(errors().secondaryDocumentFile).toEqual(undefined);
      });

      describe('Secondary Document', () => {
        beforeEach(() => {
          rawEntity.secondaryDocument = {};
        });

        it('should validate secondary document', () => {
          expect(errors().secondaryDocument).toEqual({
            category: VALIDATION_ERROR_MESSAGES.category,
            documentType: VALIDATION_ERROR_MESSAGES.documentType[1],
          });
        });
      });
    });
  });

  describe('otherFilingParty', () => {
    beforeEach(() => {
      rawEntity.dateReceived = createISODateString();
      rawEntity.documentTitle = 'Order to do something';
      rawEntity.documentType = 'Order';
      rawEntity.eventCode = 'O';
      rawEntity.partyPrimary = true;
    });

    it('should pass validation when hasOtherFilingParty is not defined', () => {
      rawEntity.hasOtherFilingParty = undefined;
      rawEntity.filers = ['abc'];

      expect(errors()).toBeNull();
    });

    it('should pass validation when hasOtherFilingParty is true and otherFilingParties has value', () => {
      rawEntity.hasOtherFilingParty = true;
      rawEntity.otherFilingParty = 'An Other Party';

      expect(errors()).toBeNull();
    });

    it('should fail validation when hasOtherFilingParty is true and otherFilingParties has no value', () => {
      rawEntity.hasOtherFilingParty = true;
      rawEntity.otherFilingParty = undefined;

      expect(errors()).toEqual({
        otherFilingParty: 'Enter other filing party name.',
      });
    });

    it('should pass validation when hasOtherFilingParty is false and otherFilingParties has no value', () => {
      rawEntity.hasOtherFilingParty = false;
      rawEntity.filers = ['abc'];
      rawEntity.otherFilingParty = undefined;

      expect(errors()).toBeNull();
    });
  });

  describe('filers', () => {
    beforeEach(() => {
      rawEntity.dateReceived = createISODateString();
      rawEntity.documentTitle = 'Notice of Change of Address';
      rawEntity.documentType = 'Notice of Change of Address';
      rawEntity.eventCode = 'NCA';
    });

    it('should not be required when isAutoGenerated is true', () => {
      rawEntity.isAutoGenerated = true;
      rawEntity.hasOtherFilingParty = false;
      rawEntity.otherFilingParty = undefined;
      rawEntity.filers = ['abc'];

      expect(errors()).toBeNull();
    });

    it('should be required when isAutoGenerated is false', () => {
      rawEntity.isAutoGenerated = false;

      expect(errors()).toEqual({
        filers: 'Select a filing party',
      });
    });

    it('should be not required when isAutoGenerated is false, filers is not empty', () => {
      rawEntity.isAutoGenerated = false;
      rawEntity.filers = ['abc'];

      expect(errors()).toBeNull();
    });

    it('should be not required when isAutoGenerated is false, filers is empty, and partyPrivatePractitioner is true', () => {
      rawEntity.isAutoGenerated = false;
      rawEntity.filers = [];
      rawEntity.partyPrivatePractitioner = true;

      expect(errors()).toBeNull();
    });

    it('should be required when isAutoGenerated, filers, partyIrsPractitioner, and partyPrivatePractitioner are false', () => {
      rawEntity.isAutoGenerated = false;
      rawEntity.filers = [];
      rawEntity.partyPrivatePractitioner = false;
      rawEntity.partyIrsPractitioner = false;
      rawEntity.hasOtherFilingParty = false;

      expect(errors()).toEqual({
        filers: 'Select a filing party',
      });
    });
  });
});
