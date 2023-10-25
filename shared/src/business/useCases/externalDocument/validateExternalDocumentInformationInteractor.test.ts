import { validateExternalDocumentInformationInteractor } from './validateExternalDocumentInformationInteractor';

describe('validateExternalDocumentInformationInteractor', () => {
  it('should return the expected validation errors object when the external document is NOT valid', () => {
    const errors = validateExternalDocumentInformationInteractor({
      documentMetadata: { filers: [] },
    });

    expect(errors).toEqual({
      certificateOfService:
        'Indicate whether you are including a Certificate of Service',
      documentType: 'Select a document type',
      filers: 'Select a filing party',
      hasSupportingDocuments: 'Enter selection for Supporting Documents.',
      primaryDocumentFile: 'Upload a document',
    });
  });

  it('should return null when the external document is valid', () => {
    const errors = validateExternalDocumentInformationInteractor({
      documentMetadata: {
        attachments: false,
        certificateOfService: false,
        documentType: 'Answer',
        filers: ['759c5880-0c81-4a50-a38b-662da37e2954'],
        hasSupportingDocuments: false,
        primaryDocumentFile: { file: 'yes!' },
      },
    });

    expect(errors).toEqual(null);
  });
});
