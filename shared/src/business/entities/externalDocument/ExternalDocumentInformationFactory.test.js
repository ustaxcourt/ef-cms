const {
  ExternalDocumentInformationFactory,
} = require('./ExternalDocumentInformationFactory');

describe('ExternalDocumentInformationFactory', () => {
  describe('validation', () => {
    it('should have no error messages for basic object', () => {
      const extDocInfo = ExternalDocumentInformationFactory.get({});
      expect(extDocInfo.getFormattedValidationErrors()).toEqual(null);
    });
  });
});
