import { ExternalDocumentInformationFactory } from '../../entities/externalDocument/ExternalDocumentInformationFactory';
import { validateExternalDocumentInformationInteractor } from './validateExternalDocumentInformationInteractor';

describe('validateExternalDocumentInformationInteractor', () => {
  it('returns the expected errors object on an empty message', () => {
    const errors = validateExternalDocumentInformationInteractor({
      documentMetadata: { filers: [] },
    });

    expect(errors).toEqual({
      certificateOfService:
        ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES
          .certificateOfService,
      filers:
        ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES.filers,
      hasSupportingDocuments:
        ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES
          .hasSupportingDocuments,
      primaryDocumentFile:
        ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES
          .primaryDocumentFile,
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
