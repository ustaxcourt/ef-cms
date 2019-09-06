const moment = require('moment');
const { ExternalDocumentFactory } = require('./ExternalDocumentFactory');

describe('ExternalDocumentNonStandardD', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const extDoc = ExternalDocumentFactory.get({
        scenario: 'Nonstandard D',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        category: 'Select a Category.',
        documentType: 'Select a Document Type.',
        previousDocument: 'Select a document.',
        serviceDate: 'Provide a service date.',
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
    const serviceDate = '2012-04-10T00:00:00-05:00';
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
        'Certificate of Service Petition 04-10-2012',
      );
    });
  });
});
