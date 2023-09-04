import { ExternalDocumentInformationFactory } from './ExternalDocumentInformationFactory';
import { SecondaryDocumentInformationFactory } from './SecondaryDocumentInformationFactory';

describe('SecondaryDocumentInformationFactory', () => {
  describe('validation', () => {
    it('should be valid with an empty object', () => {
      const extDoc = new SecondaryDocumentInformationFactory(
        {},
        ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES,
      );
      expect(extDoc.getFormattedValidationErrors()).toEqual(null);
    });

    it('should not be valid when document is a Motion, a file is selected, and objections is not present', () => {
      const extDoc = new SecondaryDocumentInformationFactory(
        {
          category: 'Motion',
          documentType: 'Motion for New Trial',
          secondaryDocumentFile: {},
        },
        ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES,
      );
      expect(extDoc.getFormattedValidationErrors()?.objections).toEqual(
        ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES.objections,
      );
    });

    it('should be valid when document is a Motion, a file is not selected, and objections is not present', () => {
      const extDoc = new SecondaryDocumentInformationFactory(
        {
          category: 'Motion',
          documentType: 'Motion for New Trial',
        },
        ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES,
      );
      expect(extDoc.getFormattedValidationErrors()).toEqual(null);
    });

    it('should be valid when document is not a Motion and objections is not present', () => {
      const extDoc = new SecondaryDocumentInformationFactory(
        {
          category: 'Answer',
          documentType: 'Answer',
        },
        ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES,
      );
      expect(extDoc.getFormattedValidationErrors()).toEqual(null);
    });

    it('should require attachments and certificateOfService of secondaryDocumentFile is selected', () => {
      const extDoc = new SecondaryDocumentInformationFactory(
        {
          secondaryDocumentFile: {},
        },
        ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES,
      );
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        certificateOfService:
          ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES
            .certificateOfService,
      });
    });

    it('should be valid with attachments and certificateOfService selected if secondaryDocumentFile is selected', () => {
      const extDoc = new SecondaryDocumentInformationFactory(
        {
          attachments: false,
          certificateOfService: false,
          secondaryDocumentFile: {},
        },
        ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES,
      );
      expect(extDoc.getFormattedValidationErrors()).toEqual(null);
    });

    describe('Has Certificate of Service', () => {
      it('should require certificate of service date be entered if certificateOfService is true and secondaryDocumentFile is present', () => {
        const extDoc = new SecondaryDocumentInformationFactory(
          {
            attachments: false,
            certificateOfService: true,
            secondaryDocumentFile: {},
          },
          ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES,
        );
        expect(extDoc.getFormattedValidationErrors()).toEqual({
          certificateOfServiceDate:
            ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES
              .certificateOfServiceDate[1],
        });
      });

      it('should not require certificate of service date to be entered if certificateOfService is false and secondaryDocumentFile is present', () => {
        const extDoc = new SecondaryDocumentInformationFactory(
          {
            attachments: false,
            certificateOfService: false,
            secondaryDocumentFile: {},
          },
          ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES,
        );
        expect(extDoc.getFormattedValidationErrors()).toEqual(null);
      });
    });
  });
});
