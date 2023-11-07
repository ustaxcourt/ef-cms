import { CaseAssociationRequestDocumentTypeC } from '@shared/business/entities/caseAssociation/CaseAssociationRequestDocumentTypeC';
import {
  INITIAL_DOCUMENT_TYPES,
  OBJECTIONS_OPTIONS,
  SCENARIOS,
} from '@shared/business/entities/EntityConstants';

describe('CaseAssociationRequestDocumentTypeC', () => {
  describe('validations', () => {
    const VALID_REQUEST_DOC_C = {
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
      const entity = new CaseAssociationRequestDocumentTypeC(
        VALID_REQUEST_DOC_C,
      );

      const errors = entity.getFormattedValidationErrors();
      expect(errors).toEqual(null);
    });

    it('should return error message for "attachments", "hasSupportingDocuments", "objections" when they fail validation', () => {
      const entity = new CaseAssociationRequestDocumentTypeC({
        ...VALID_REQUEST_DOC_C,
        attachments: 'NOT A BOOLEAN',
        hasSupportingDocuments: 'NOT A BOOLEAN',
        objections: 'INVALID VALUE',
      });

      const errors = entity.getFormattedValidationErrors();
      expect(errors).toEqual({
        attachments: 'Enter selection for Attachments.',
        hasSupportingDocuments: 'Enter selection for Supporting Documents.',
        objections: 'Enter selection for Objections.',
      });
    });
  });
});
