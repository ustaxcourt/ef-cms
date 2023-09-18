import { ExternalDocumentInformationFactory } from '../../entities/externalDocument/ExternalDocumentInformationFactory';
import { validateExternalDocumentInteractor } from './validateExternalDocumentInteractor';

describe('validateExternalDocumentInteractor', () => {
  it('returns the expected errors object on an empty message', () => {
    const errors = validateExternalDocumentInteractor({
      documentMetadata: {},
    });

    expect(errors).toEqual({
      category:
        ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES.category,
      documentType:
        ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES
          .documentType[1],
    });
  });

  it('returns no errors when all fields are defined', () => {
    const errors = validateExternalDocumentInteractor({
      documentMetadata: {
        category: 'Application',
        documentType: 'Application for Waiver of Filing Fee',
        scenario: 'Standard',
      },
    });

    expect(errors).toEqual(null);
  });
});
