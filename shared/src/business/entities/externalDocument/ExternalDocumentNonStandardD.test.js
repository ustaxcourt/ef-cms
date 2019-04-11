const moment = require('moment');
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

    it('should have error message for future date', () => {
      const serviceDate = moment()
        .add(1, 'days')
        .format();
      const extDoc = ExternalDocumentFactory.get({
        category: 'Supporting Document',
        documentTitle: 'Certificate of Service [Document Name] [Date]',
        documentType: 'Certificate of Service',
        previousDocument: 'Petition',
        scenario: 'Nonstandard D',
        serviceDate,
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        serviceDate:
          'Service date is in the future. Please enter a valid date.',
      });
    });

    it('should be valid when all fields are present', () => {
      const serviceDate = moment().format();
      const extDoc = ExternalDocumentFactory.get({
        category: 'Supporting Document',
        documentTitle: 'Certificate of Service [Document Name] [Date]',
        documentType: 'Certificate of Service',
        previousDocument: 'Petition',
        scenario: 'Nonstandard D',
        serviceDate,
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual(null);
    });
  });

  describe('title generation', () => {
    const serviceDate = moment('2012-04-10').format();
    it('should generate valid title', () => {
      const extDoc = ExternalDocumentFactory.get({
        category: 'Supporting Document',
        documentTitle: 'Certificate of Service [Document Name] [Date]',
        documentType: 'Certificate of Service',
        previousDocument: 'Petition',
        scenario: 'Nonstandard D',
        serviceDate,
      });
      expect(extDoc.getDocumentTitle()).toEqual(
        `Certificate of Service Petition 04-10-2012`,
      );
    });
  });
});
