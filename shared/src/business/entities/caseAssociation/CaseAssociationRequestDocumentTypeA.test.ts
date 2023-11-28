import { CaseAssociationRequestDocumentTypeA } from './CaseAssociationRequestDocumentTypeA';

describe('CaseAssociationRequestFactory', () => {
  it('should, in addition to the base document requirements, require attachments', () => {
    const entity = new CaseAssociationRequestDocumentTypeA({
      attachments: undefined,
      documentType: 'Notice of Intervention',
    });

    expect(entity.getFormattedValidationErrors()!.attachments).toEqual(
      'Enter selection for Attachments.',
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
