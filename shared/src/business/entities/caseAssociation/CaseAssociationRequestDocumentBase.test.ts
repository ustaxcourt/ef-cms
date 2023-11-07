import { CaseAssociationRequestDocumentBase } from './CaseAssociationRequestDocumentBase';
import {
  INITIAL_DOCUMENT_TYPES,
  SCENARIOS,
} from '@shared/business/entities/EntityConstants';

describe('CaseAssociationRequestDocumentBase', () => {
  describe('validation', () => {
    const rawTestData = {
      certificateOfService: false,
      documentTitleTemplate: 'documentTitleTemplate',
      documentType:
        INITIAL_DOCUMENT_TYPES.applicationForWaiverOfFilingFee.documentType,
      eventCode:
        INITIAL_DOCUMENT_TYPES.applicationForWaiverOfFilingFee.eventCode,
      partyIrsPractitioner: true,
      primaryDocumentFile: {},
      scenario: SCENARIOS[0],
    };

    it('should create entity without any validation errors', () => {
      const entity = new CaseAssociationRequestDocumentBase(rawTestData);

      const errors = entity.getFormattedValidationErrors();
      expect(errors).toEqual(null);
    });

    it('should return default message when "attachments" is not a boolean', () => {
      const entity = new CaseAssociationRequestDocumentBase({
        ...rawTestData,
        attachments: 'NOT A BOOLEAN',
      });

      const errors = entity.getFormattedValidationErrors();
      expect(errors).toEqual({
        attachments: 'Enter selection for Attachments.',
      });
    });

    it('should return default message when "certificateOfService" is not a boolean', () => {
      const entity = new CaseAssociationRequestDocumentBase({
        ...rawTestData,
        certificateOfService: 'NOT A BOOLEAN',
      });

      const errors = entity.getFormattedValidationErrors();
      expect(errors).toEqual({
        certificateOfService:
          'Indicate whether you are including a Certificate of Service',
      });
    });

    it('should return default message when "certificateOfService" is not defined', () => {
      const entity = new CaseAssociationRequestDocumentBase({
        ...rawTestData,
        certificateOfService: undefined,
      });

      const errors = entity.getFormattedValidationErrors();
      expect(errors).toEqual({
        certificateOfService:
          'Indicate whether you are including a Certificate of Service',
      });
    });

    it('should return default message when "certificateOfServiceDate" is not defined', () => {
      const entity = new CaseAssociationRequestDocumentBase({
        ...rawTestData,
        certificateOfService: true,
        certificateOfServiceDate: undefined,
      });

      const errors = entity.getFormattedValidationErrors();
      expect(errors).toEqual({
        certificateOfServiceDate: 'Enter date of service',
      });
    });

    it('should return error message when "certificateOfServiceDate" is a future date', () => {
      const entity = new CaseAssociationRequestDocumentBase({
        ...rawTestData,
        certificateOfService: true,
        certificateOfServiceDate: '9999-01-01T01:01:01.000Z',
      });

      const errors = entity.getFormattedValidationErrors();
      expect(errors).toEqual({
        certificateOfServiceDate:
          'Certificate of Service date cannot be in the future. Enter a valid date.',
      });
    });

    it('should return default error message when string documentTitle less than 1 character', () => {
      const entity = new CaseAssociationRequestDocumentBase({
        ...rawTestData,
        documentTitle: '',
      });

      const errors = entity.getFormattedValidationErrors();
      expect(errors).toEqual({
        documentTitle:
          'Document title must be 500 characters or fewer. Update this document title and try again.',
      });
    });

    it('should return default error message when string documentTitle is greater than 500 characters', () => {
      const entity = new CaseAssociationRequestDocumentBase({
        ...rawTestData,
        documentTitle: generateString(501, 'a'),
      });

      const errors = entity.getFormattedValidationErrors();
      expect(errors).toEqual({
        documentTitle:
          'Document title must be 500 characters or fewer. Update this document title and try again.',
      });
    });

    it('should return default error message when "documentType" is not defined', () => {
      const entity = new CaseAssociationRequestDocumentBase({
        ...rawTestData,
        documentType: undefined,
      });
      const errors = entity.getFormattedValidationErrors();
      expect(errors).toEqual({ documentType: 'Select a document type' });
    });

    it('should return error message when "documentType" is an invalid value', () => {
      const entity = new CaseAssociationRequestDocumentBase({
        ...rawTestData,
        documentType: 'invalid document type',
      });
      const errors = entity.getFormattedValidationErrors();
      expect(errors).toEqual({
        documentType: 'Select a document type',
      });
    });

    it('should return default error message when "filers" is not an empty array when "partyIrsPractitioner" is true', () => {
      const entity = new CaseAssociationRequestDocumentBase({
        ...rawTestData,
        filers: ['a'],
      });
      const errors = entity.getFormattedValidationErrors();
      expect(errors).toEqual({ filers: 'Select a party' });
    });

    it('should return default error message when "filers" is an empty array and "partyIrsPractitioner" is false', () => {
      const entity = new CaseAssociationRequestDocumentBase({
        ...rawTestData,
        filers: [],
        partyIrsPractitioner: false,
      });
      const errors = entity.getFormattedValidationErrors();
      expect(errors).toEqual({ filers: 'Select a party' });
    });

    it('should return default error message when "filers" contains an item that is not a UUID string and "partyIrsPractitioner" is false', () => {
      const entity = new CaseAssociationRequestDocumentBase({
        ...rawTestData,
        filers: ['not a uuid formatted string'],
        partyIrsPractitioner: false,
      });

      const errors = entity.getFormattedValidationErrors();
      expect(errors).toEqual({
        'filers[0]': '"filers[0]" must be a valid GUID',
      });
    });

    it('should return the default JOI error message for "partyPrivatePractitioner" when it is not a boolean', () => {
      const entity = new CaseAssociationRequestDocumentBase({
        ...rawTestData,
        partyPrivatePractitioner: 'NOT A BOOLEAN',
      });

      const errors = entity.getFormattedValidationErrors();
      expect(errors).toEqual({
        partyPrivatePractitioner:
          '"partyPrivatePractitioner" must be a boolean',
      });
    });
  });
});

function generateString(length, character = ' ') {
  if (length <= 0) return '';
  return character.repeat(length);
}
