import { validateExternalDocumentInformationInteractor } from './validateExternalDocumentInformationInteractor';

describe('validateExternalDocumentInformationInteractor', () => {
  it('returns the expected errors object on an empty message', () => {
    const errors = validateExternalDocumentInformationInteractor({
      documentMetadata: { filers: [] },
    });

    expect(errors).toEqual({
      certificateOfService:
        'Indicate whether you are including a Certificate of Service',
      filers: 'Select a filing party',
      hasSupportingDocuments: 'Enter selection for Supporting Documents.',
      primaryDocumentFile: 'Upload a document',
    });
  });

  it('returns no errors when all fields are defined', () => {
    const errors = validateExternalDocumentInformationInteractor({
      documentMetadata: {
        attachments: false,
        certificateOfService: false,
        filers: ['759c5880-0c81-4a50-a38b-662da37e2954'],
        hasSupportingDocuments: false,
        primaryDocumentFile: { file: 'yes!' },
      },
    });

    expect(errors).toEqual(null);
  });
});
