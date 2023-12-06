import { ExternalDocumentFactory } from './ExternalDocumentFactory';
import { ExternalDocumentNonStandardD } from './ExternalDocumentNonStandardD';
import {
  calculateISODate,
  createISODateString,
} from '../../utilities/DateHandler';
import { getTextByCount } from '../../utilities/getTextByCount';

describe('ExternalDocumentNonStandardD', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const externalDocumentD = ExternalDocumentFactory({
        scenario: 'Nonstandard D',
      });

      expect(externalDocumentD.getFormattedValidationErrors()).toEqual({
        category:
          ExternalDocumentNonStandardD.VALIDATION_ERROR_MESSAGES.category,
        documentType:
          ExternalDocumentNonStandardD.VALIDATION_ERROR_MESSAGES
            .documentType[1],
        previousDocument:
          ExternalDocumentNonStandardD.VALIDATION_ERROR_MESSAGES
            .previousDocument,
        serviceDate:
          ExternalDocumentNonStandardD.VALIDATION_ERROR_MESSAGES.serviceDate[1],
      });
    });

    it('should have error message for future date', () => {
      const serviceDate = calculateISODate({ howMuch: 1, units: 'days' });

      const externalDocumentD = ExternalDocumentFactory({
        category: 'Supporting Document',
        documentTitle: 'Certificate of Service [Document Name] [Date]',
        documentType: 'Certificate of Service',
        previousDocument: { documentType: 'Petition' },
        scenario: 'Nonstandard D',
        serviceDate,
      });

      expect(externalDocumentD.getFormattedValidationErrors()).toEqual({
        serviceDate:
          ExternalDocumentNonStandardD.VALIDATION_ERROR_MESSAGES.serviceDate[0]
            .message,
      });
    });

    it('should be valid when all fields are present', () => {
      const serviceDate = createISODateString();

      const externalDocumentD = ExternalDocumentFactory({
        category: 'Supporting Document',
        documentTitle: 'Certificate of Service [Document Name] [Date]',
        documentType: 'Certificate of Service',
        previousDocument: { documentType: 'Petition' },
        scenario: 'Nonstandard D',
        serviceDate,
      });

      expect(externalDocumentD.getFormattedValidationErrors()).toEqual(null);
    });

    it('should be invalid when serviceDate is undefined-undefined-undefined', () => {
      const serviceDate = 'undefined-undefined-undefined';

      const externalDocumentD = ExternalDocumentFactory({
        category: 'Supporting Document',
        documentTitle: 'Certificate of Service [Document Name] [Date]',
        documentType: 'Certificate of Service',
        previousDocument: { documentType: 'Petition' },
        scenario: 'Nonstandard D',
        serviceDate,
      });

      expect(externalDocumentD.getFormattedValidationErrors()).toEqual({
        serviceDate:
          ExternalDocumentNonStandardD.VALIDATION_ERROR_MESSAGES.serviceDate[1],
      });
    });

    it('should be invalid when documentTitle is over 3000 characters', () => {
      const serviceDate = createISODateString();

      const externalDocumentD = ExternalDocumentFactory({
        category: 'Supporting Document',
        documentTitle: getTextByCount(3001),
        documentType: 'Certificate of Service',
        previousDocument: { documentType: 'Petition' },
        scenario: 'Nonstandard D',
        serviceDate,
      });

      expect(externalDocumentD.getFormattedValidationErrors()).toEqual({
        documentTitle:
          ExternalDocumentNonStandardD.VALIDATION_ERROR_MESSAGES.documentTitle,
      });
    });
  });

  describe('title generation', () => {
    const serviceDate = '2012-04-10T04:00:00.000Z';

    it('should generate valid title with previousDocument documentType', () => {
      const externalDocumentD = ExternalDocumentFactory({
        category: 'Supporting Document',
        documentTitle: 'Certificate of Service [Document Name] [Date]',
        documentType: 'Certificate of Service',
        previousDocument: { documentType: 'Petition' },
        scenario: 'Nonstandard D',
        serviceDate,
      });

      expect(externalDocumentD.getDocumentTitle()).toEqual(
        'Certificate of Service Petition 04-10-2012',
      );
    });

    it('should generate valid title with previousDocument documentTitle', () => {
      const externalDocumentD = ExternalDocumentFactory({
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

      expect(externalDocumentD.getDocumentTitle()).toEqual(
        'Certificate of Service Stipulation Something 04-10-2012',
      );
    });

    it('should generate title without previousDocument', () => {
      const externalDocumentD = ExternalDocumentFactory({
        category: 'Supporting Document',
        documentTitle: 'Certificate of Service [Document Name] [Date]',
        documentType: 'Certificate of Service',
        scenario: 'Nonstandard D',
        serviceDate,
      });

      expect(externalDocumentD.getDocumentTitle()).toEqual(
        'Certificate of Service  04-10-2012',
      );
    });
  });
});
