const joi = require('joi-browser');
const moment = require('moment');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { replaceBracketed } = require('../../utilities/getDocumentTitle');

/**
 *
 * @param rawProps
 * @constructor
 */
function ExternalDocumentNonStandardD(rawProps) {
  Object.assign(this, rawProps);
}

ExternalDocumentNonStandardD.prototype.getDocumentTitle = function() {
  return replaceBracketed(
    this.documentType,
    this.previousDocument,
    moment.utc(this.serviceDate).format('MM-DD-YYYY'),
  );
};

ExternalDocumentNonStandardD.errorToMessageMap = {
  category: 'You must select a category.',
  documentType: 'You must select a document type.',
  previousDocument: 'You must select a document.',
  serviceDate: 'You must provide a service date.',
};

ExternalDocumentNonStandardD.schema = joi.object().keys({
  category: joi.string().required(),
  documentType: joi.string().required(),
  previousDocument: joi.string().required(),
  serviceDate: joi
    .date()
    .iso()
    .max('now')
    .required(),
});

joiValidationDecorator(
  ExternalDocumentNonStandardD,
  ExternalDocumentNonStandardD.schema,
  undefined,
  ExternalDocumentNonStandardD.errorToMessageMap,
);

module.exports = { ExternalDocumentNonStandardD };
