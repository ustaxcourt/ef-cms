const {
  ExternalDocumentInformationFactory,
} = require('./ExternalDocumentInformationFactory');

describe('ExternalDocumentInformationFactory', () => {
  let baseDoc;

  describe('Standard Document', () => {
    beforeEach(() => {
      baseDoc = {
        category: 'Application',
        documentTitle: 'Application for Waiver of Filing Fee',
        documentType: 'Application for Waiver of Filing Fee',
        scenario: 'Standard',
      };
    });

    it('should require primary document file', () => {});

    it('should require certificate of service radio be selected', () => {});

    describe('Has Certificate of Service', () => {
      beforeEach(() => {
        baseDoc.certificateOfService = true;
      });

      it('should require certificate of service date be entered', () => {});

      it('should require certificate of service date be in the past', () => {});
    });

    it('should require exhibits radio be selected', () => {});

    it('should require attachments radio be selected', () => {});
  });

  describe('validation', () => {
    it('should have error messages for basic object', () => {
      const extDocInfo = ExternalDocumentInformationFactory.get({});
      expect(extDocInfo.getFormattedValidationErrors()).toEqual({
        attachments: 'Attachments is required.',
        certificateOfService: 'Certificate Of Service is required.',
        exhibits: 'Exhibits is required.',
        hasSupportingDocuments: 'Has Supporting Documents is required.',
        primaryDocument: 'A file was not selected.',
      });
    });
  });
});
