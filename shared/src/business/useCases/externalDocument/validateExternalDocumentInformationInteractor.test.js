const {
  validateExternalDocumentInformationInteractor,
} = require('./validateExternalDocumentInformationInteractor');

describe('validateExternalDocumentInformationInteractor', () => {
  let ExternalDocumentInformationFactory;
  let spy;

  beforeEach(() => {
    spy = jest.fn().mockReturnValue(null);
    ExternalDocumentInformationFactory = {
      get: () => ({
        getFormattedValidationErrors: spy,
      }),
    };
  });

  it('calls external document information factory to get validation errors', () => {
    const errors = validateExternalDocumentInformationInteractor({
      applicationContext: {
        getEntityConstructors: () => ({
          ExternalDocumentInformationFactory,
        }),
      },
      documentMetadata: {},
    });

    expect(errors).toEqual(null);
  });
});
