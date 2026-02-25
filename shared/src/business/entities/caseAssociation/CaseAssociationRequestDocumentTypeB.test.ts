import { CaseAssociationRequestDocumentTypeB } from './CaseAssociationRequestDocumentTypeB';

describe('CaseAssociationRequestDocumentTypeB', () => {
  it('should map supportingDocuments through SupportingDocumentInformationFactory when provided', () => {
    const entity = new CaseAssociationRequestDocumentTypeB({
      documentType: 'Notice of Intervention',
      documentTitleTemplate: 'Testing []',
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
    const entity = new CaseAssociationRequestDocumentTypeB({
      documentType: 'Notice of Intervention',
      documentTitleTemplate: 'Testing []',
    });

    expect(entity.supportingDocuments).toBeUndefined();
  });

  it('should return "Respondent" in document title when partyIrsPractitioner is true', () => {
    const entity = new CaseAssociationRequestDocumentTypeB({
      documentType: 'Notice of Intervention',
      documentTitleTemplate: 'Testing []',
      partyIrsPractitioner: true,
    });

    expect(entity.getDocumentTitle([])).toEqual('Testing Respondent');
  });

  it('should return "Petrs." in document title when there are multiple filers', () => {
    const entity = new CaseAssociationRequestDocumentTypeB({
      documentType: 'Notice of Intervention',
      documentTitleTemplate: 'Testing []',
      filers: ['abc', 'def'],
    });

    expect(
      entity.getDocumentTitle([
        { contactId: 'abc', name: 'Alice' },
        { contactId: 'def', name: 'Bob' },
      ]),
    ).toEqual('Testing Petrs. Alice & Bob');
  });

  it('should return "Petr." in document title with single filer', () => {
    const entity = new CaseAssociationRequestDocumentTypeB({
      documentType: 'Notice of Intervention',
      documentTitleTemplate: 'Testing []',
      filers: ['abc'],
    });

    expect(
      entity.getDocumentTitle([{ contactId: 'abc', name: 'Bob' }]),
    ).toEqual('Testing Petr. Bob');
  });
});
