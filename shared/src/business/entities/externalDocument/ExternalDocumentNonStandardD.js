const joi = require('joi-browser');
const moment = require('moment');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { replaceBracketed } = require('../../utilities/replaceBracketed');

/**
 *
 * @param rawProps
 * @constructor
 */
function ExternalDocumentNonStandardD(rawProps) {
  Object.assign(this, {
    category: rawProps.category,
    documentTitle: rawProps.documentTitle,
    documentType: rawProps.documentType,
    previousDocument: rawProps.previousDocument,
    serviceDate: rawProps.serviceDate,
  });
}

ExternalDocumentNonStandardD.prototype.getDocumentTitle = function() {
  return replaceBracketed(
    this.documentTitle,
    this.previousDocument,
    moment.utc(this.serviceDate).format('MM-DD-YYYY'),
  );
};

ExternalDocumentNonStandardD.errorToMessageMap = {
  category: 'Select a Category.',
  documentType: 'Select a Document Type.',
  previousDocument: 'Select a document.',
  serviceDate: [
    {
      contains: 'must be less than or equal to',
      message: 'Service date is in the future. Please enter a valid date.',
    },
    'Provide a service date.',
  ],
};

ExternalDocumentNonStandardD.schema = {
  category: joi.string().required(),
  documentTitle: joi.string().optional(),
  documentType: joi.string().required(),
  previousDocument: joi.string().required(),
  serviceDate: joi
    .date()
    .iso()
    .max('now')
    .required(),
};

joiValidationDecorator(
  ExternalDocumentNonStandardD,
  ExternalDocumentNonStandardD.schema,
  undefined,
  ExternalDocumentNonStandardD.errorToMessageMap,
);

module.exports = { ExternalDocumentNonStandardD };
