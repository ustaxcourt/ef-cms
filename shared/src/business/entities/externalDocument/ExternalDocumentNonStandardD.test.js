const {
  calculateISODate,
  createISODateString,
} = require('../../utilities/DateHandler');
const {
  over3000Characters,
} = require('../../test/createTestApplicationContext');
const {
  VALIDATION_ERROR_MESSAGES,
} = require('./ExternalDocumentInformationFactory');
const { ExternalDocumentFactory } = require('./ExternalDocumentFactory');

describe('ExternalDocumentNonStandardD', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const extDoc = ExternalDocumentFactory.get({
        scenario: 'Nonstandard D',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        category: VALIDATION_ERROR_MESSAGES.category,
        documentType: VALIDATION_ERROR_MESSAGES.documentType[1],
        previousDocument: VALIDATION_ERROR_MESSAGES.previousDocument,
        serviceDate: VALIDATION_ERROR_MESSAGES.serviceDate[1],
      });
    });

    it('should have error message for future date', () => {
      const serviceDate = calculateISODate({ howMuch: 1, unit: 'days' });
      const extDoc = ExternalDocumentFactory.get({
        category: 'Supporting Document',
        documentTitle: 'Certificate of Service [Document Name] [Date]',
        documentType: 'Certificate of Service',
        previousDocument: { documentType: 'Petition' },
        scenario: 'Nonstandard D',
        serviceDate,
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        serviceDate: VALIDATION_ERROR_MESSAGES.serviceDate[0].message,
      });
    });

    it('should be valid when all fields are present', () => {
      const serviceDate = createISODateString();
      const extDoc = ExternalDocumentFactory.get({
        category: 'Supporting Document',
        documentTitle: 'Certificate of Service [Document Name] [Date]',
        documentType: 'Certificate of Service',
        previousDocument: { documentType: 'Petition' },
        scenario: 'Nonstandard D',
        serviceDate,
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual(null);
    });

    it('should be invalid when serviceDate is undefined-undefined-undefined', () => {
      const serviceDate = 'undefined-undefined-undefined';
      const extDoc = ExternalDocumentFactory.get({
        category: 'Supporting Document',
        documentTitle: 'Certificate of Service [Document Name] [Date]',
        documentType: 'Certificate of Service',
        previousDocument: { documentType: 'Petition' },
        scenario: 'Nonstandard D',
        serviceDate,
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        serviceDate: VALIDATION_ERROR_MESSAGES.serviceDate[1],
      });
    });

    it('should be invalid when documentTitle is over 3000 characters', () => {
      const serviceDate = createISODateString();
      const extDoc = ExternalDocumentFactory.get({
        category: 'Supporting Document',
        documentTitle: over3000Characters,
        documentType: 'Certificate of Service',
        previousDocument: { documentType: 'Petition' },
        scenario: 'Nonstandard D',
        serviceDate,
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        documentTitle: VALIDATION_ERROR_MESSAGES.documentTitle,
      });
    });
  });

  describe('title generation', () => {
    const serviceDate = '2012-04-10T04:00:00.000Z';
    it('should generate valid title with previousDocument documentType', () => {
      const extDoc = ExternalDocumentFactory.get({
        category: 'Supporting Document',
        documentTitle: 'Certificate of Service [Document Name] [Date]',
        documentType: 'Certificate of Service',
        previousDocument: { documentType: 'Petition' },
        scenario: 'Nonstandard D',
        serviceDate,
      });
      expect(extDoc.getDocumentTitle()).toEqual(
        'Certificate of Service Petition 04-10-2012',
      );
    });

    it('should generate valid title with previousDocument documentTitle', () => {
      const extDoc = ExternalDocumentFactory.get({
        category: 'Supporting Document',
        documentTitle: 'Certificate of Service [Document Name] [Date]',
        documentType: 'Certificate of Service',
        previousDocument: {
          documentTitle: 'Stipulation Something',
          documentType: 'Stipulation',
        },
        scenario: 'Nonstandard D',
        serviceDate,
      });
      expect(extDoc.getDocumentTitle()).toEqual(
        'Certificate of Service Stipulation Something 04-10-2012',
      );
    });

    it('should generate title without previousDocument', () => {
      const extDoc = ExternalDocumentFactory.get({
        category: 'Supporting Document',
        documentTitle: 'Certificate of Service [Document Name] [Date]',
        documentType: 'Certificate of Service',
        scenario: 'Nonstandard D',
        serviceDate,
      });
      expect(extDoc.getDocumentTitle()).toEqual(
        'Certificate of Service  04-10-2012',
      );
    });
  });
});
