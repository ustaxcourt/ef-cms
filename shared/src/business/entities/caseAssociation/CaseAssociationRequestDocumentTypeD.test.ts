import { CaseAssociationRequestDocumentTypeD } from '@shared/business/entities/caseAssociation/CaseAssociationRequestDocumentTypeD';
import { GENERATION_TYPES } from '@web-client/getConstants';
import {
  INITIAL_DOCUMENT_TYPES,
  OBJECTIONS_OPTIONS,
  SCENARIOS,
} from '@shared/business/entities/EntityConstants';

describe('CaseAssociationRequestDocumentTypeD', () => {
  describe('validations', () => {
    const VALID_REQUEST_DOC_D = {
      attachments: true,
      certificateOfService: true,
      certificateOfServiceDate: '2016-01-01T01:01:01.000Z',
      documentTitleTemplate: 'documentTitleTemplate',
      documentType:
        INITIAL_DOCUMENT_TYPES.applicationForWaiverOfFilingFee.documentType,
      eventCode:
        INITIAL_DOCUMENT_TYPES.applicationForWaiverOfFilingFee.eventCode,
      filers: [],
      hasSupportingDocuments: true,
      objections: OBJECTIONS_OPTIONS[0],
      partyIrsPractitioner: true,
      primaryDocumentFile: {},
      scenario: SCENARIOS[0],
    };

    it('should return null when there are no validation errors', () => {
      const entity = new CaseAssociationRequestDocumentTypeD(
        VALID_REQUEST_DOC_D,
      );

      const errors = entity.getValidationErrors();
      expect(errors).toEqual(null);
    });

    it('should require primary document file type when generation type is manual', () => {
      const entity = new CaseAssociationRequestDocumentTypeD({
        ...VALID_REQUEST_DOC_D,
        generationType: GENERATION_TYPES.MANUAL,
        primaryDocumentFile: undefined,
      });

      const errors = entity.getValidationErrors();
      expect(errors).toEqual({
        primaryDocumentFile: 'Upload a document',
      });
    });

    it('should not require primary document file type when generation type is auto', () => {
      const entity = new CaseAssociationRequestDocumentTypeD({
        ...VALID_REQUEST_DOC_D,
        generationType: GENERATION_TYPES.AUTO,
        primaryDocumentFile: undefined,
      });

      const errors = entity.getValidationErrors();
      expect(errors).toEqual(null);
    });
  });
});
