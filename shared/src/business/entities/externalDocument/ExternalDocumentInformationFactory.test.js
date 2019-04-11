const {
  ExternalDocumentInformationFactory,
} = require('./ExternalDocumentInformationFactory');

describe('ExternalDocumentInformationFactory', () => {
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
