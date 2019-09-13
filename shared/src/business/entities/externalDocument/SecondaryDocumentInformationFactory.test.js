const {
  SecondaryDocumentInformationFactory,
} = require('./SecondaryDocumentInformationFactory');

describe('SecondaryDocumentInformationFactory', () => {
  describe('validation', () => {
    it('should be valid with an empty object', () => {
      const extDoc = SecondaryDocumentInformationFactory.get({});
      expect(extDoc.getFormattedValidationErrors()).toEqual(null);
    });

    it('should not be valid when document is a Motion, a file is selected, and objections is not present', () => {
      const extDoc = SecondaryDocumentInformationFactory.get({
        category: 'Motion',
        documentType: 'Motion for New Trial',
        secondaryDocumentFile: {},
      });
      expect(extDoc.getFormattedValidationErrors().objections).toEqual(
        'Enter selection for Objections.',
      );
    });

    it('should be valid when document is a Motion, a file is not selected, and objections is not present', () => {
      const extDoc = SecondaryDocumentInformationFactory.get({
        category: 'Motion',
        documentType: 'Motion for New Trial',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual(null);
    });

    it('should be valid when document is not a Motion and objections is not present', () => {
      const extDoc = SecondaryDocumentInformationFactory.get({
        category: 'Answer',
        documentType: 'Answer',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual(null);
    });

    it('should require attachments and certificateOfService of secondaryDocumentFile is selected', () => {
      const extDoc = SecondaryDocumentInformationFactory.get({
        secondaryDocumentFile: {},
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        attachments: 'Enter selection for Attachments.',
        certificateOfService: 'Indicate whether you are including a Certificate of Service',
      });
    });

    it('should be valid with attachments and certificateOfService selected if secondaryDocumentFile is selected', () => {
      const extDoc = SecondaryDocumentInformationFactory.get({
        attachments: false,
        certificateOfService: false,
        secondaryDocumentFile: {},
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual(null);
    });

    describe('Has Certificate of Service', () => {
      it('should require certificate of service date be entered if certificateOfService is true and secondaryDocumentFile is present', () => {
        const extDoc = SecondaryDocumentInformationFactory.get({
          attachments: false,
          certificateOfService: true,
          secondaryDocumentFile: {},
        });
        expect(extDoc.getFormattedValidationErrors()).toEqual({
          certificateOfServiceDate: 'Enter date of service',
        });
      });

      it('should not require certificate of service date to be entered if certificateOfService is false and secondaryDocumentFile is present', () => {
        const extDoc = SecondaryDocumentInformationFactory.get({
          attachments: false,
          certificateOfService: false,
          secondaryDocumentFile: {},
        });
        expect(extDoc.getFormattedValidationErrors()).toEqual(null);
      });
    });
  });
});
