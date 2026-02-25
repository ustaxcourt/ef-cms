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

  it('should map supportingDocuments through SupportingDocumentInformationFactory when provided', () => {
    const entity = new CaseAssociationRequestDocumentTypeA({
      documentType: 'Notice of Intervention',
      supportingDocuments: [
        {
          documentTitle: 'Supporting Document 1',
          documentType: 'Supporting Document',
        },
      ],
    });

    expect(entity.supportingDocuments).toBeDefined();
    expect(entity.supportingDocuments).toHaveLength(1);
  });

  it('should not map supportingDocuments when they are not provided', () => {
    const entity = new CaseAssociationRequestDocumentTypeA({
      documentType: 'Notice of Intervention',
    });

    expect(entity.supportingDocuments).toBeUndefined();
  });
});
