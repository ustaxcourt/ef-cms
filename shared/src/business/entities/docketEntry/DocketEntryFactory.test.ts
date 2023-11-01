import {
  AMICUS_BRIEF_EVENT_CODE,
  OBJECTIONS_OPTIONS_MAP,
} from '../EntityConstants';
import { DocketEntryFactory } from './DocketEntryFactory';
import {
  calculateISODate,
  createISODateString,
} from '../../utilities/DateHandler';
import { getTextByCount } from '../../utilities/getTextByCount';

describe('DocketEntryFactory', () => {
  let rawEntity;

  beforeEach(() => {
    rawEntity = {
      filers: [],
    };
  });

  it('should require a file if isDocumentRequired', () => {
    rawEntity.isDocumentRequired = true;

    expect(
      new DocketEntryFactory(rawEntity).getValidationErrors()!
        .primaryDocumentFile,
    ).toBeDefined();
  });

  it('should require a file', () => {
    rawEntity.primaryDocumentFile = {};
    rawEntity.primaryDocumentFileSize = 1;

    expect(
      new DocketEntryFactory(rawEntity).getValidationErrors()!
        .primaryDocumentFile,
    ).toEqual(undefined);
  });

  it('should return an error when an empty document is attached', () => {
    rawEntity.primaryDocumentFile = {};
    rawEntity.primaryDocumentFileSize = 0;

    expect(
      new DocketEntryFactory(rawEntity).getValidationErrors()!
        .primaryDocumentFile,
    ).toEqual(undefined);
    expect(
      new DocketEntryFactory(rawEntity).getValidationErrors()!
        .primaryDocumentFileSize,
    ).toEqual('Your document file size is empty.');
  });

  it('should not require a filing status selection', () => {
    expect(
      new DocketEntryFactory(rawEntity).getValidationErrors()!.lodged,
    ).toEqual(undefined);
  });

  it('should not require an other iteration value', () => {
    expect(
      new DocketEntryFactory(rawEntity).getValidationErrors()!.otherIteration,
    ).toEqual(undefined);
  });

  it('should require received date be entered', () => {
    expect(
      new DocketEntryFactory(rawEntity).getValidationErrors()!.receivedAt,
    ).toEqual('Enter a valid date received');
    rawEntity.receivedAt = createISODateString();
    expect(
      new DocketEntryFactory(rawEntity).getValidationErrors()!.receivedAt,
    ).toEqual(undefined);
  });

  it('should not allow received date be in the future', () => {
    rawEntity.receivedAt = calculateISODate({ howMuch: 1, units: 'days' });

    expect(
      new DocketEntryFactory(rawEntity).getValidationErrors()!.receivedAt,
    ).toEqual('Received date cannot be in the future. Enter a valid date.');
  });

  it('should be invalid when additionalInfo is over 500 characters long', () => {
    rawEntity.additionalInfo = getTextByCount(1001);
    expect(
      new DocketEntryFactory(rawEntity).getValidationErrors()!.additionalInfo,
    ).toEqual('Limit is 500 characters. Enter 500 or fewer characters.');
  });

  it('should be invalid when additionalInfo2 is over 500 characters long', () => {
    rawEntity.additionalInfo2 = getTextByCount(1001);
    expect(
      new DocketEntryFactory(rawEntity).getValidationErrors()!.additionalInfo2,
    ).toEqual('Limit is 500 characters. Enter 500 or fewer characters.');
  });

  it('should require event code', () => {
    expect(
      new DocketEntryFactory(rawEntity).getValidationErrors()!.eventCode,
    ).toBeDefined();
  });

  it('should not require Additional info 1', () => {
    expect(
      new DocketEntryFactory(rawEntity).getValidationErrors()!.additionalInfo,
    ).toEqual(undefined);
  });

  it('should not require Additional info 2', () => {
    expect(
      new DocketEntryFactory(rawEntity).getValidationErrors()!.additionalInfo2,
    ).toEqual(undefined);
  });

  it('should not require add to cover sheet', () => {
    expect(
      new DocketEntryFactory(rawEntity).getValidationErrors()!.addToCoversheet,
    ).toEqual(undefined);
  });

  describe('objections', () => {
    it('should require objections when eventCode is ADMT and previous document is an objection document type', () => {
      rawEntity.eventCode = 'ADMT';
      rawEntity.previousDocument = {
        eventCode: 'APLD',
      };

      expect(
        new DocketEntryFactory(rawEntity).getValidationErrors()!.objections,
      ).toBeDefined();
    });

    it('should require objections when eventCode is AMAT and previous document is an objection document type', () => {
      rawEntity.eventCode = 'AMAT';
      rawEntity.previousDocument = {
        eventCode: 'APLD',
      };

      expect(
        new DocketEntryFactory(rawEntity).getValidationErrors()!.objections,
      ).toBeDefined();
    });

    it('should require objections when document is an objection document type', () => {
      rawEntity.eventCode = 'APLD';

      expect(
        new DocketEntryFactory(rawEntity).getValidationErrors()!.objections,
      ).toBeDefined();
    });

    it('should be optional when the docket entry is a paper filing and the docket entry is a motion', () => {
      rawEntity.eventCode = 'M006'; // Motion for Continuance
      rawEntity.isPaper = true;

      expect(
        new DocketEntryFactory(rawEntity).getValidationErrors()!.objections,
      ).toBeUndefined();
    });
  });

  describe('documentType', () => {
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
      expect(
        new DocketEntryFactory(rawEntity).getValidationErrors()!.ordinalValue,
      ).toEqual('Select an iteration');
      rawEntity.ordinalValue = 'First';
      expect(
        new DocketEntryFactory(rawEntity).getValidationErrors()!.ordinalValue,
      ).toEqual(undefined);
    });
  });

  describe('Inclusions', () => {
    it('should not require Certificate of Service', () => {
      expect(
        new DocketEntryFactory(rawEntity).getValidationErrors()!
          .certificateOfService,
      ).toEqual(undefined);
    });

    describe('Has Certificate of Service', () => {
      beforeEach(() => {
        rawEntity.certificateOfService = true;
      });

      it('should require certificate of service date be entered', () => {
        expect(
          new DocketEntryFactory(rawEntity).getValidationErrors()!
            .certificateOfServiceDate,
        ).toEqual('Enter date of service');
        rawEntity.certificateOfServiceDate = createISODateString();
        expect(
          new DocketEntryFactory(rawEntity).getValidationErrors()!
            .certificateOfServiceDate,
        ).toEqual(undefined);
      });

      it('should not allow certificate of service date be in the future', () => {
        rawEntity.certificateOfServiceDate = calculateISODate({
          howMuch: 1,
          units: 'days',
        });
        expect(
          new DocketEntryFactory(rawEntity).getValidationErrors()!
            .certificateOfServiceDate,
        ).toEqual(
          'Certificate of Service date cannot be in the future. Enter a valid date.',
        );
      });
    });

    it('should not require Attachments', () => {
      expect(
        new DocketEntryFactory(rawEntity).getValidationErrors()!.attachments,
      ).toEqual(undefined);
    });

    it('should not require Objections', () => {
      expect(
        new DocketEntryFactory(rawEntity).getValidationErrors()!.objections,
      ).toEqual(undefined);
    });

    describe('Motion Document', () => {
      beforeEach(() => {
        rawEntity.category = 'Motion';
        rawEntity.eventCode = 'M006';
      });

      it('should require Objections', () => {
        expect(
          new DocketEntryFactory(rawEntity).getValidationErrors()!.objections,
        ).toEqual('Enter selection for Objections.');
        rawEntity.objections = OBJECTIONS_OPTIONS_MAP.NO;
        expect(
          new DocketEntryFactory(rawEntity).getValidationErrors()!.objections,
        ).toEqual(undefined);
      });

      it('should require Objections for an Amended document with a Motion previousDocument', () => {
        rawEntity.category = 'Miscellaneous';
        rawEntity.eventCode = 'AMAT';
        rawEntity.previousDocument = {
          eventCode: 'M006',
        };
        expect(
          new DocketEntryFactory(rawEntity).getValidationErrors()!.objections,
        ).toEqual('Enter selection for Objections.');
        rawEntity.objections = OBJECTIONS_OPTIONS_MAP.NO;
        expect(
          new DocketEntryFactory(rawEntity).getValidationErrors()!.objections,
        ).toEqual(undefined);
      });
    });

    describe('Nonstandard H', () => {
      beforeEach(() => {
        rawEntity.scenario = 'Nonstandard H';
      });

      it('should not require secondary file', () => {
        expect(
          new DocketEntryFactory(rawEntity).getValidationErrors()!
            .secondaryDocumentFile,
        ).toEqual(undefined);
      });

      describe('Secondary Document', () => {
        beforeEach(() => {
          rawEntity.secondaryDocument = {};
        });

        it('should validate secondary document', () => {
          expect(
            new DocketEntryFactory(rawEntity).getValidationErrors()!
              .secondaryDocument,
          ).toEqual({
            category: 'Select a Category.',
            documentType: 'Select a document type',
          });
        });
      });
    });
  });

  describe('otherFilingParty', () => {
    beforeEach(() => {
      rawEntity.receivedAt = createISODateString();
      rawEntity.documentTitle = 'Order to do something';
      rawEntity.documentType = 'Order';
      rawEntity.eventCode = 'O';
      rawEntity.partyPrimary = true;
    });

    it(`should be required when the docket entry event code is ${AMICUS_BRIEF_EVENT_CODE}`, () => {
      rawEntity.eventCode = AMICUS_BRIEF_EVENT_CODE;

      const validationErrors = new DocketEntryFactory(
        rawEntity,
      ).getValidationErrors()!;

      expect(validationErrors.otherFilingParty).toBeDefined();
    });

    it('should pass validation when hasOtherFilingParty is not defined and the docket entry event code is NOT "AMBR"', () => {
      rawEntity.hasOtherFilingParty = undefined;
      rawEntity.eventCode = 'O';
      rawEntity.filers = ['b4379b44-df5c-43c9-8912-68a9c179a780'];

      expect(
        new DocketEntryFactory(rawEntity).getValidationErrors()!,
      ).toBeNull();
    });

    it('should pass validation when hasOtherFilingParty is true and otherFilingParties has value', () => {
      rawEntity.hasOtherFilingParty = true;
      rawEntity.otherFilingParty = 'An Other Party';

      expect(
        new DocketEntryFactory(rawEntity).getValidationErrors()!,
      ).toBeNull();
    });

    it('should fail validation when hasOtherFilingParty is true and otherFilingParties has no value', () => {
      rawEntity.hasOtherFilingParty = true;
      rawEntity.otherFilingParty = undefined;

      expect(new DocketEntryFactory(rawEntity).getValidationErrors()!).toEqual({
        otherFilingParty: 'Enter other filing party name.',
      });
    });

    it('should pass validation when hasOtherFilingParty is false and otherFilingParties has no value', () => {
      rawEntity.hasOtherFilingParty = false;
      rawEntity.filers = ['b4379b44-df5c-43c9-8912-68a9c179a780'];
      rawEntity.otherFilingParty = undefined;

      expect(
        new DocketEntryFactory(rawEntity).getValidationErrors()!,
      ).toBeNull();
    });
  });

  describe('filers', () => {
    beforeEach(() => {
      rawEntity.receivedAt = createISODateString();
      rawEntity.documentTitle = 'Notice of Change of Address';
      rawEntity.documentType = 'Notice of Change of Address';
      rawEntity.eventCode = 'NCA';
    });

    it('should not be required when isAutoGenerated is true', () => {
      rawEntity.isAutoGenerated = true;
      rawEntity.hasOtherFilingParty = false;
      rawEntity.otherFilingParty = undefined;
      rawEntity.filers = undefined;

      expect(
        new DocketEntryFactory(rawEntity).getValidationErrors()!,
      ).toBeNull();
    });

    it('should be optional when the docket entry event code is "AMBR"', () => {
      rawEntity.eventCode = AMICUS_BRIEF_EVENT_CODE;
      rawEntity.otherFilingParty = 'Mike Tyson';

      expect(
        new DocketEntryFactory(rawEntity).getValidationErrors()!,
      ).toBeNull();
    });

    it('should be required when isAutoGenerated is false', () => {
      rawEntity.servedAt = undefined;
      rawEntity.partyIrsPractitioner = false;
      rawEntity.partyPrivatePractitioner = false;
      rawEntity.hasOtherFilingParty = false;
      rawEntity.isAutoGenerated = false;

      expect(new DocketEntryFactory(rawEntity).getValidationErrors()!).toEqual({
        filers: 'Select a filing party',
      });
    });

    it('should be not required when isAutoGenerated is false, filers is not empty', () => {
      rawEntity.isAutoGenerated = false;
      rawEntity.filers = ['b4379b44-df5c-43c9-8912-68a9c179a780'];

      expect(
        new DocketEntryFactory(rawEntity).getValidationErrors()!,
      ).toBeNull();
    });

    it('should be not required when isAutoGenerated is false, filers is empty, and partyPrivatePractitioner is true', () => {
      rawEntity.isAutoGenerated = false;
      rawEntity.filers = [];
      rawEntity.partyPrivatePractitioner = true;

      expect(
        new DocketEntryFactory(rawEntity).getValidationErrors()!,
      ).toBeNull();
    });

    it('should be required when isAutoGenerated, filers, partyIrsPractitioner, and partyPrivatePractitioner are false', () => {
      rawEntity.isAutoGenerated = false;
      rawEntity.filers = [];
      rawEntity.partyPrivatePractitioner = false;
      rawEntity.partyIrsPractitioner = false;
      rawEntity.hasOtherFilingParty = false;

      expect(new DocketEntryFactory(rawEntity).getValidationErrors()!).toEqual({
        filers: 'Select a filing party',
      });
    });
  });
});
