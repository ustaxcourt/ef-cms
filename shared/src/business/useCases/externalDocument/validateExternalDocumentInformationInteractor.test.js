const sinon = require('sinon');
const {
  validateExternalDocumentInformation,
} = require('./validateExternalDocumentInformationInteractor');

describe('validateExternalDocumentInformation', () => {
  let ExternalDocumentInformationFactory;
  let spy;

  beforeEach(() => {
    spy = sinon.stub().returns(null);
    ExternalDocumentInformationFactory = {
      get: () => ({
        getFormattedValidationErrors: spy,
      }),
    };
  });

  it('calls external document information factory to get validation errors', () => {
    const errors = validateExternalDocumentInformation({
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
