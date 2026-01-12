import { CaseAssociationRequestDocumentTypeD } from './CaseAssociationRequestDocumentTypeD';

describe('CaseAssociationRequestDocumentTypeD', () => {
  it('should also validate any supporting documents', () => {
    const entity = new CaseAssociationRequestDocumentTypeD({
      attachments: undefined,
      documentType: 'Notice of Intervention',
      supportingDocuments: [{
        documentTitle: 'Supporting Document 1',
        documentType: 'Supporting Document',
        documentId: '123',
      }],
    });

    expect(entity.getFormattedValidationErrors()!.supportingDocuments).toEqual([{
      certificateOfService: 'Indicate whether you are including a Certificate of Service',
      index: 0,
      supportingDocument: 'Select a document type',
    }]);
  });

  it('get documentTitle should return the expected document title', () => {
    const entity = new CaseAssociationRequestDocumentTypeD({
      attachments: undefined,
      documentType: 'Notice of Intervention',
      documentTitleTemplate: 'Testing []',
      filers: [
        'abc',
      ],
      supportingDocuments: [{
        documentTitle: 'Supporting Document 1',
        documentType: 'Supporting Document',
        documentId: '123',
      }],
    });

    expect(entity.getDocumentTitle([
      {
        contactId: 'abc',
        name: 'Bob',
      }])).toEqual('Testing Petr. Bob')
  });


});
