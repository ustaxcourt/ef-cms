const { JoiValidationConstants } = require('../JoiValidationConstants');

const externalDocumentDecorator = (obj, rawObj) => {
  obj.category = rawObj.category;
  obj.documentTitle = rawObj.documentTitle;
  obj.documentType = rawObj.documentType;
};

const baseExternalDocumentValidation = {
  category: JoiValidationConstants.STRING.required(),
  documentTitle: JoiValidationConstants.DOCUMENT_TITLE.optional(),
  documentType: JoiValidationConstants.STRING.required(),
};

exports.externalDocumentDecorator = externalDocumentDecorator;
exports.baseExternalDocumentValidation = baseExternalDocumentValidation;
