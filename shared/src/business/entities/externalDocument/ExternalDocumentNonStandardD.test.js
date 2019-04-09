const { ExternalDocumentFactory } = require('./ExternalDocumentFactory');

describe('ExternalDocumentNonStandardD', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const extDoc = ExternalDocumentFactory.get({
        scenario: 'Nonstandard D',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        category: 'You must select a category.',
        documentType: 'You must select a document type.',
        previousDocument: 'You must select a document.',
        serviceDate: 'You must provide a service date.',
      });
    });

    it('should be valid when all fields are present', () => {
      const serviceDate = new Date().toISOString();
      const extDoc = ExternalDocumentFactory.get({
        category: 'Supporting Document',
        documentType: 'Certificate of Service [Document Name] [Date]',
        previousDocument: 'Petition',
        scenario: 'Nonstandard D',
        serviceDate,
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual(null);
    });
  });

  describe('title generation', () => {
    const serviceDate = new Date().toISOString();
    it('should generate valid title', () => {
      const extDoc = ExternalDocumentFactory.get({
        category: 'Supporting Document',
        documentType: 'Certificate of Service [Document Name] [Date]',
        previousDocument: 'Petition',
        scenario: 'Nonstandard D',
        serviceDate,
      });
      expect(extDoc.getDocumentTitle()).toEqual(
        `Certificate of Service Petition ${serviceDate}`,
      );
    });
  });
});
