const {
  SecondaryDocumentInformationFactory,
} = require('./SecondaryDocumentInformationFactory');
const {
  VALIDATION_ERROR_MESSAGES,
} = require('./ExternalDocumentInformationFactory');

describe('SecondaryDocumentInformationFactory', () => {
  describe('validation', () => {
    it('should be valid with an empty object', () => {
      const extDoc = SecondaryDocumentInformationFactory.get(
        {},
        VALIDATION_ERROR_MESSAGES,
      );
      expect(extDoc.getFormattedValidationErrors()).toEqual(null);
    });

    it('should not be valid when document is a Motion, a file is selected, and objections is not present', () => {
      const extDoc = SecondaryDocumentInformationFactory.get(
        {
          category: 'Motion',
          documentType: 'Motion for New Trial',
          secondaryDocumentFile: {},
        },
        VALIDATION_ERROR_MESSAGES,
      );
      expect(extDoc.getFormattedValidationErrors().objections).toEqual(
        VALIDATION_ERROR_MESSAGES.objections,
      );
    });

    it('should be valid when document is a Motion, a file is not selected, and objections is not present', () => {
      const extDoc = SecondaryDocumentInformationFactory.get(
        {
          category: 'Motion',
          documentType: 'Motion for New Trial',
        },
        VALIDATION_ERROR_MESSAGES,
      );
      expect(extDoc.getFormattedValidationErrors()).toEqual(null);
    });

    it('should be valid when document is not a Motion and objections is not present', () => {
      const extDoc = SecondaryDocumentInformationFactory.get(
        {
          category: 'Answer',
          documentType: 'Answer',
        },
        VALIDATION_ERROR_MESSAGES,
      );
      expect(extDoc.getFormattedValidationErrors()).toEqual(null);
    });

    it('should require attachments and certificateOfService of secondaryDocumentFile is selected', () => {
      const extDoc = SecondaryDocumentInformationFactory.get(
        {
          secondaryDocumentFile: {},
        },
        VALIDATION_ERROR_MESSAGES,
      );
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        attachments: VALIDATION_ERROR_MESSAGES.attachments,
        certificateOfService: VALIDATION_ERROR_MESSAGES.certificateOfService,
      });
    });

    it('should be valid with attachments and certificateOfService selected if secondaryDocumentFile is selected', () => {
      const extDoc = SecondaryDocumentInformationFactory.get(
        {
          attachments: false,
          certificateOfService: false,
          secondaryDocumentFile: {},
        },
        VALIDATION_ERROR_MESSAGES,
      );
      expect(extDoc.getFormattedValidationErrors()).toEqual(null);
    });

    describe('Has Certificate of Service', () => {
      it('should require certificate of service date be entered if certificateOfService is true and secondaryDocumentFile is present', () => {
        const extDoc = SecondaryDocumentInformationFactory.get(
          {
            attachments: false,
            certificateOfService: true,
            secondaryDocumentFile: {},
          },
          VALIDATION_ERROR_MESSAGES,
        );
        expect(extDoc.getFormattedValidationErrors()).toEqual({
          certificateOfServiceDate:
            VALIDATION_ERROR_MESSAGES.certificateOfServiceDate[1],
        });
      });

      it('should not require certificate of service date to be entered if certificateOfService is false and secondaryDocumentFile is present', () => {
        const extDoc = SecondaryDocumentInformationFactory.get(
          {
            attachments: false,
            certificateOfService: false,
            secondaryDocumentFile: {},
          },
          VALIDATION_ERROR_MESSAGES,
        );
        expect(extDoc.getFormattedValidationErrors()).toEqual(null);
      });
    });
  });
});
