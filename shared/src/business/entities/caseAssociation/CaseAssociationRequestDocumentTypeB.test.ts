import { CaseAssociationRequestDocumentTypeB } from '@shared/business/entities/caseAssociation/CaseAssociationRequestDocumentTypeB';
import {
  INITIAL_DOCUMENT_TYPES,
  OBJECTIONS_OPTIONS,
  SCENARIOS,
} from '@shared/business/entities/EntityConstants';

describe('CaseAssociationRequestDocumentTypeB', () => {
  describe('validations', () => {
    const VALID_REQUEST_DOC_B = {
      certificateOfService: true,
      certificateOfServiceDate: '2016-01-01T01:01:01.000Z',
      documentTitleTemplate: 'documentTitleTemplate',
      documentType:
        INITIAL_DOCUMENT_TYPES.applicationForWaiverOfFilingFee.documentType,
      eventCode:
        INITIAL_DOCUMENT_TYPES.applicationForWaiverOfFilingFee.eventCode,
      filers: [],
      objections: OBJECTIONS_OPTIONS[0],
      partyIrsPractitioner: true,
      primaryDocumentFile: {},
      scenario: SCENARIOS[0],
    };

    it('should return null when there are no validation errors', () => {
      const entity = new CaseAssociationRequestDocumentTypeB(
        VALID_REQUEST_DOC_B,
      );

      const errors = entity.getValidationErrors();
      expect(errors).toEqual(null);
    });

    it('should return error message when "objections" is not a valid string', () => {
      const entity = new CaseAssociationRequestDocumentTypeB({
        ...VALID_REQUEST_DOC_B,
        objections: 'INVALID VALUE',
      });

      const errors = entity.getValidationErrors();
      expect(errors).toEqual({
        objections: 'Enter selection for Objections.',
      });
    });
  });
});
