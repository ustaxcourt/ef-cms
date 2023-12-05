import { CaseAssociationRequestFactory } from './CaseAssociationRequestFactory';
import { OBJECTIONS_OPTIONS_MAP } from '../EntityConstants';
import {
  calculateISODate,
  createISODateString,
} from '../../utilities/DateHandler';

describe('CaseAssociationRequestFactory', () => {
  const mockPrimaryId = '149e24c2-5d66-4037-bf13-a7d440e5afc8';
  const mockSecondaryId = '361ad2cf-623a-4e00-b419-8e5320b42734';

  let rawEntity;

  describe('Base', () => {
    beforeEach(() => {
      rawEntity = {};
    });

    it('should require a file', () => {
      expect(
        CaseAssociationRequestFactory(rawEntity).getFormattedValidationErrors()!
          .primaryDocumentFile,
      ).toEqual('Upload a document');

      rawEntity.primaryDocumentFile = {};

      expect(
        CaseAssociationRequestFactory(rawEntity).getFormattedValidationErrors()!
          .primaryDocumentFile,
      ).toEqual(undefined);
    });

    it('should require a certificate Of Service selection', () => {
      expect(
        CaseAssociationRequestFactory(rawEntity).getFormattedValidationErrors()!
          .certificateOfService,
      ).toEqual('Indicate whether you are including a Certificate of Service');

      rawEntity.certificateOfService = false;

      expect(
        CaseAssociationRequestFactory(rawEntity).getFormattedValidationErrors()!
          .certificateOfService,
      ).toEqual(undefined);
    });

    it('should require document type', () => {
      expect(
        CaseAssociationRequestFactory(rawEntity).getFormattedValidationErrors()!
          .documentType,
      ).toEqual('Select a document type');

      rawEntity.documentType = 'Entry of Appearance';

      expect(
        CaseAssociationRequestFactory(rawEntity).getFormattedValidationErrors()!
          .documentType,
      ).toEqual(undefined);
    });

    it('should require document title template', () => {
      expect(
        CaseAssociationRequestFactory(rawEntity).getFormattedValidationErrors()!
          .documentTitleTemplate,
      ).toEqual('Select a document');

      rawEntity.documentTitleTemplate =
        'Entry of Appearance for [Petitioner Names]';

      expect(
        CaseAssociationRequestFactory(rawEntity).getFormattedValidationErrors()!
          .documentTitleTemplate,
      ).toEqual(undefined);
    });

    it('should require event code', () => {
      expect(
        CaseAssociationRequestFactory(rawEntity).getFormattedValidationErrors()!
          .eventCode,
      ).toEqual('Select a document');

      rawEntity.eventCode = 'P';

      expect(
        CaseAssociationRequestFactory(rawEntity).getFormattedValidationErrors()!
          .eventCode,
      ).toEqual(undefined);
    });

    it('should require scenario title', () => {
      expect(
        CaseAssociationRequestFactory(rawEntity).getFormattedValidationErrors()!
          .scenario,
      ).toEqual('Select a document');

      rawEntity.scenario = 'Standard';

      expect(
        CaseAssociationRequestFactory(rawEntity).getFormattedValidationErrors()!
          .scenario,
      ).toEqual(undefined);
    });

    describe('Has Certificate of Service', () => {
      beforeEach(() => {
        rawEntity.certificateOfService = true;
      });

      it('should require certificate of service date to be entered', () => {
        expect(
          CaseAssociationRequestFactory(
            rawEntity,
          ).getFormattedValidationErrors()!.certificateOfServiceDate,
        ).toEqual('Enter date of service');

        rawEntity.certificateOfServiceDate = createISODateString();

        expect(
          CaseAssociationRequestFactory(
            rawEntity,
          ).getFormattedValidationErrors()!.certificateOfServiceDate,
        ).toEqual(undefined);
      });

      it('should not allow certificate of service date to be in the future', () => {
        rawEntity.certificateOfServiceDate = calculateISODate({
          dateString: createISODateString(),
          howMuch: 1,
          units: 'days',
        });

        expect(
          CaseAssociationRequestFactory(
            rawEntity,
          ).getFormattedValidationErrors()!.certificateOfServiceDate,
        ).toEqual(
          'Certificate of Service date cannot be in the future. Enter a valid date.',
        );
      });
    });

    describe('Substitution of Counsel', () => {
      beforeEach(() => {
        rawEntity.documentTitleTemplate =
          'Substitution of Counsel for [Petitioner Names]';
        rawEntity.documentType = 'Substitution of Counsel';
      });

      it('should require objections be selected', () => {
        expect(
          CaseAssociationRequestFactory(
            rawEntity,
          ).getFormattedValidationErrors()!.objections,
        ).toEqual('Enter selection for Objections.');

        rawEntity.objections = OBJECTIONS_OPTIONS_MAP.NO;

        expect(
          CaseAssociationRequestFactory(
            rawEntity,
          ).getFormattedValidationErrors()!.objections,
        ).toEqual(undefined);
      });
    });

    describe('Motion to Substitute Parties and Change Caption', () => {
      beforeEach(() => {
        rawEntity.documentTitleTemplate =
          'Motion to Substitute Parties and Change Caption';
        rawEntity.documentType =
          'Motion to Substitute Parties and Change Caption';
      });

      it('should require attachments be selected', () => {
        expect(
          CaseAssociationRequestFactory(
            rawEntity,
          ).getFormattedValidationErrors()!.attachments,
        ).toEqual('Enter selection for Attachments.');

        rawEntity.attachments = false;

        expect(
          CaseAssociationRequestFactory(
            rawEntity,
          ).getFormattedValidationErrors()!.attachments,
        ).toEqual(undefined);
      });

      it('should require objections be selected', () => {
        expect(
          CaseAssociationRequestFactory(
            rawEntity,
          ).getFormattedValidationErrors()!.objections,
        ).toEqual('Enter selection for Objections.');

        rawEntity.objections = OBJECTIONS_OPTIONS_MAP.NO;

        expect(
          CaseAssociationRequestFactory(
            rawEntity,
          ).getFormattedValidationErrors()!.objections,
        ).toEqual(undefined);
      });

      it('should require has supporting documents be selected', () => {
        expect(
          CaseAssociationRequestFactory(
            rawEntity,
          ).getFormattedValidationErrors()!.hasSupportingDocuments,
        ).toEqual('Enter selection for Supporting Documents.');

        rawEntity.hasSupportingDocuments = false;

        expect(
          CaseAssociationRequestFactory(
            rawEntity,
          ).getFormattedValidationErrors()!.hasSupportingDocuments,
        ).toEqual(undefined);
      });

      describe('Has supporting documents', () => {
        beforeEach(() => {
          rawEntity.hasSupportingDocuments = true;
          rawEntity.supportingDocuments = [
            { attachments: false, certificateOfService: false },
          ];
        });

        it('should require supporting document type be entered', () => {
          expect(
            CaseAssociationRequestFactory(
              rawEntity,
            ).getFormattedValidationErrors()!.supportingDocuments[0]
              .supportingDocument,
          ).toEqual('Select a document type');

          rawEntity.supportingDocuments[0].supportingDocument = 'Brief';

          expect(
            CaseAssociationRequestFactory(
              rawEntity,
            ).getFormattedValidationErrors()!.supportingDocuments,
          ).toEqual(undefined);
        });

        it('should require certificate of service date to be entered if certificateOfService is true', () => {
          rawEntity.supportingDocuments[0].certificateOfService = true;
          rawEntity.supportingDocuments[0].supportingDocument = 'brief';

          expect(
            CaseAssociationRequestFactory(
              rawEntity,
            ).getFormattedValidationErrors()!.supportingDocuments[0]
              .certificateOfServiceDate,
          ).toEqual('Enter date of service');

          rawEntity.supportingDocuments[0].certificateOfServiceDate =
            createISODateString();

          expect(
            CaseAssociationRequestFactory(
              rawEntity,
            ).getFormattedValidationErrors()!.supportingDocuments,
          ).toEqual(undefined);
        });
      });
    });

    it('should require one filer to be selected', () => {
      expect(
        CaseAssociationRequestFactory(rawEntity).getFormattedValidationErrors()!
          .filers,
      ).toEqual('Select a party');

      rawEntity.filers = ['c41fdac6-cc16-4ca6-97fc-980ebb618dd5'];

      expect(
        CaseAssociationRequestFactory(rawEntity).getFormattedValidationErrors()!
          .filers,
      ).toEqual(undefined);
    });

    describe('title generation', () => {
      const petitioners = [
        {
          contactId: mockPrimaryId,
          name: 'Test Petitioner',
        },
        {
          contactId: mockSecondaryId,
          name: 'Another Petitioner',
        },
      ];

      it('should generate valid title for representingPrimary', () => {
        const caseAssoc = CaseAssociationRequestFactory({
          documentTitleTemplate:
            'Substitution of Counsel for [Petitioner Names]',
          documentType: 'Substitution of Counsel',
          filers: [mockPrimaryId],
        });

        expect(caseAssoc.getDocumentTitle(petitioners)).toEqual(
          'Substitution of Counsel for Petr. Test Petitioner',
        );
      });

      it('should generate valid title for representingSecondary', () => {
        const caseAssoc = CaseAssociationRequestFactory({
          documentTitleTemplate:
            'Substitution of Counsel for [Petitioner Names]',
          documentType: 'Substitution of Counsel',
          filers: [mockSecondaryId],
        });

        expect(caseAssoc.getDocumentTitle(petitioners)).toEqual(
          'Substitution of Counsel for Petr. Another Petitioner',
        );
      });

      it('should generate valid title for representingPrimary and representingSecondary', () => {
        const caseAssoc = CaseAssociationRequestFactory({
          documentTitleTemplate:
            'Substitution of Counsel for [Petitioner Names]',
          documentType: 'Substitution of Counsel',
          filers: [mockPrimaryId, mockSecondaryId],
        });

        expect(caseAssoc.getDocumentTitle(petitioners)).toEqual(
          'Substitution of Counsel for Petrs. Test Petitioner & Another Petitioner',
        );
      });

      it('should generate valid title and ignore parties for item without concatenation', () => {
        const caseAssoc = CaseAssociationRequestFactory({
          documentTitleTemplate:
            'Motion to Substitute Parties and Change Caption',
          documentType: 'Motion to Substitute Parties and Change Caption',
          filers: [mockPrimaryId, mockSecondaryId],
        });

        expect(caseAssoc.getDocumentTitle(petitioners)).toEqual(
          'Motion to Substitute Parties and Change Caption',
        );
      });

      it('should generate valid title when party is irsPractitioner', () => {
        const caseAssoc = CaseAssociationRequestFactory({
          documentTitleTemplate:
            'Substitution of Counsel for [Petitioner Names]',
          documentType: 'Substitution of Counsel',
          partyIrsPractitioner: true,
        });

        expect(caseAssoc.getDocumentTitle(petitioners)).toEqual(
          'Substitution of Counsel for Respondent',
        );
      });
    });
  });
});
