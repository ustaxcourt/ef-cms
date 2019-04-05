const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');

/**
 *
 * @param rawProps
 * @constructor
 */
function ExternalDocumentNonStandardD(rawProps) {
  Object.assign(this, rawProps);
}

ExternalDocumentNonStandardD.errorToMessageMap = {
  category: 'You must select a category.',
  date: 'You must provide a service date.',
  documentName: 'You must select a document.',
  documentType: 'You must select a document type.',
};

ExternalDocumentNonStandardD.schema = joi.object().keys({
  category: joi.string().required(),
  date: joi
    .date()
    .iso()
    .max('now')
    .required(),
  documentName: joi.string().required(),
  documentType: joi.string().required(),
});

joiValidationDecorator(
  ExternalDocumentNonStandardD,
  ExternalDocumentNonStandardD.schema,
  undefined,
  ExternalDocumentNonStandardD.errorToMessageMap,
);

module.exports = { ExternalDocumentNonStandardD };
