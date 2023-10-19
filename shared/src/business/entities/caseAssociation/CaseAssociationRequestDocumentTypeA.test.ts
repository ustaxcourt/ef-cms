import { CaseAssociationRequestDocumentTypeA } from './CaseAssociationRequestDocumentTypeA';
import { extractCustomMessages } from '@shared/business/entities/utilities/extractCustomMessages';

describe('CaseAssociationRequestFactory', () => {
  it('should, in addition to the base document requirements, require attachments', () => {
    const entity = new CaseAssociationRequestDocumentTypeA({
      attachments: undefined,
      documentType: 'Notice of Intervention',
    });
    const customMessages = extractCustomMessages(entity.getValidationRules());

    expect(entity.getFormattedValidationErrors()!.attachments).toEqual(
      customMessages.attachments[0],
    );
  });

  it('should return the document title template as the generated document title', () => {
    const mockDocumentTitleTemplate = 'Coming soon, to a Tax Court near you';

    const entity = new CaseAssociationRequestDocumentTypeA({
      documentTitleTemplate: mockDocumentTitleTemplate,
      documentType: 'Notice of Intervention',
    });

    expect(entity.getDocumentTitle()).toEqual(mockDocumentTitleTemplate);
  });
});
