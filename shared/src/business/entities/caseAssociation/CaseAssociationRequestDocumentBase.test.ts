import { CaseAssociationRequestDocumentBase } from './CaseAssociationRequestDocumentBase';

describe('CaseAssociationRequestDocumentBase', () => {
  it('should map supportingDocuments through SupportingDocumentInformationFactory when provided', () => {
    const entity = new CaseAssociationRequestDocumentBase({
      documentType: 'Notice of Intervention',
      documentTitleTemplate: 'Testing',
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
    const entity = new CaseAssociationRequestDocumentBase({
      documentType: 'Notice of Intervention',
      documentTitleTemplate: 'Testing',
    });

    expect(entity.supportingDocuments).toBeUndefined();
  });

  it('should return the document title template as the document title', () => {
    const entity = new CaseAssociationRequestDocumentBase({
      documentType: 'Notice of Intervention',
      documentTitleTemplate: 'My Document Title',
    });

    expect(entity.getDocumentTitle()).toEqual('My Document Title');
  });
});
