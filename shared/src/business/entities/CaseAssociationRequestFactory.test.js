const {
  calculateISODate,
  createISODateString,
} = require('../utilities/DateHandler');
const {
  CaseAssociationRequestFactory,
} = require('./CaseAssociationRequestFactory');
const { OBJECTIONS_OPTIONS_MAP } = require('../entities/EntityConstants');

const { VALIDATION_ERROR_MESSAGES } = CaseAssociationRequestFactory;

describe('CaseAssociationRequestFactory', () => {
  const mockPrimaryId = '149e24c2-5d66-4037-bf13-a7d440e5afc8';
  const mockSecondaryId = '361ad2cf-623a-4e00-b419-8e5320b42734';

  let rawEntity;

  const errors = () =>
    CaseAssociationRequestFactory(rawEntity).getFormattedValidationErrors();

  describe('Base', () => {
    beforeEach(() => {
      rawEntity = {};
    });

    it('should require a file', () => {
      expect(errors().primaryDocumentFile).toEqual(
        VALIDATION_ERROR_MESSAGES.primaryDocumentFile,
      );
      rawEntity.primaryDocumentFile = {};
      expect(errors().primaryDocumentFile).toEqual(undefined);
    });

    it('should require a certificate Of Service selection', () => {
      expect(errors().certificateOfService).toEqual(
        VALIDATION_ERROR_MESSAGES.certificateOfService,
      );
      rawEntity.certificateOfService = false;
      expect(errors().certificateOfService).toEqual(undefined);
    });

    it('should require document type', () => {
      expect(errors().documentType).toEqual(
        VALIDATION_ERROR_MESSAGES.documentType[1],
      );
      rawEntity.documentType = 'Entry of Appearance';
      expect(errors().documentType).toEqual(undefined);
    });

    it('should require document title template', () => {
      expect(errors().documentTitleTemplate).toEqual(
        VALIDATION_ERROR_MESSAGES.documentTitleTemplate,
      );
      rawEntity.documentTitleTemplate =
        'Entry of Appearance for [Petitioner Names]';
      expect(errors().documentTitleTemplate).toEqual(undefined);
    });

    it('should require event code', () => {
      expect(errors().eventCode).toEqual(VALIDATION_ERROR_MESSAGES.eventCode);
      rawEntity.eventCode = 'P';
      expect(errors().eventCode).toEqual(undefined);
    });

    it('should require scenario title', () => {
      expect(errors().scenario).toEqual(VALIDATION_ERROR_MESSAGES.scenario);
      rawEntity.scenario = 'Standard';
      expect(errors().scenario).toEqual(undefined);
    });

    describe('Has Certificate of Service', () => {
      beforeEach(() => {
        rawEntity.certificateOfService = true;
      });

      it('should require certificate of service date to be entered', () => {
        expect(errors().certificateOfServiceDate).toEqual(
          VALIDATION_ERROR_MESSAGES.certificateOfServiceDate[1],
        );
        rawEntity.certificateOfServiceDate = createISODateString();
        expect(errors().certificateOfServiceDate).toEqual(undefined);
      });

      it('should not allow certificate of service date to be in the future', () => {
        rawEntity.certificateOfServiceDate = calculateISODate({
          dateString: createISODateString(),
          howMuch: 1,
          unit: 'days',
        });
        expect(errors().certificateOfServiceDate).toEqual(
          VALIDATION_ERROR_MESSAGES.certificateOfServiceDate[0].message,
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
        expect(errors().objections).toEqual(
          VALIDATION_ERROR_MESSAGES.objections,
        );
        rawEntity.objections = OBJECTIONS_OPTIONS_MAP.NO;
        expect(errors().objections).toEqual(undefined);
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
        expect(errors().attachments).toEqual(
          VALIDATION_ERROR_MESSAGES.attachments,
        );
        rawEntity.attachments = false;
        expect(errors().attachments).toEqual(undefined);
      });

      it('should require objections be selected', () => {
        expect(errors().objections).toEqual(
          VALIDATION_ERROR_MESSAGES.objections,
        );
        rawEntity.objections = OBJECTIONS_OPTIONS_MAP.NO;
        expect(errors().objections).toEqual(undefined);
      });

      it('should require has supporting documents be selected', () => {
        expect(errors().hasSupportingDocuments).toEqual(
          VALIDATION_ERROR_MESSAGES.hasSupportingDocuments,
        );
        rawEntity.hasSupportingDocuments = false;
        expect(errors().hasSupportingDocuments).toEqual(undefined);
      });

      describe('Has supporting documents', () => {
        beforeEach(() => {
          rawEntity.hasSupportingDocuments = true;
          rawEntity.supportingDocuments = [
            { attachments: false, certificateOfService: false },
          ];
        });
        it('should require supporting document type be entered', () => {
          expect(errors().supportingDocuments[0].supportingDocument).toEqual(
            VALIDATION_ERROR_MESSAGES.supportingDocument,
          );
          rawEntity.supportingDocuments[0].supportingDocument = 'Brief';

          expect(errors().supportingDocuments).toEqual(undefined);
        });

        it('should require certificate of service date to be entered if certificateOfService is true', () => {
          rawEntity.supportingDocuments[0].certificateOfService = true;
          rawEntity.supportingDocuments[0].supportingDocument = 'brief';
          expect(
            errors().supportingDocuments[0].certificateOfServiceDate,
          ).toEqual(VALIDATION_ERROR_MESSAGES.certificateOfServiceDate[1]);
          rawEntity.supportingDocuments[0].certificateOfServiceDate =
            createISODateString();
          expect(errors().supportingDocuments).toEqual(undefined);
        });
      });
    });

    it('should require one filer to be selected', () => {
      expect(errors().filers).toEqual(VALIDATION_ERROR_MESSAGES.filers);
      rawEntity.filers = ['c41fdac6-cc16-4ca6-97fc-980ebb618dd5'];
      expect(errors().filers).toEqual(undefined);
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
