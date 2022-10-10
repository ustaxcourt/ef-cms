const joi = require('joi');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('./JoiValidationDecorator');
const {
  PRACTITIONER_DOCUMENT_TYPES,
  PRACTITIONER_DOCUMENT_TYPES_MAP,
} = require('./EntityConstants');
const { JoiValidationConstants } = require('./JoiValidationConstants');

/**
 * constructor
 *
 * @param {object} providers the providers object
 * @param {object} providers.rawStamp the raw document data
 * @constructor
 */
function Document() {
  this.entityName = 'Document';
}

Document.prototype.init = function init(rawDocument, { applicationContext }) {
  this.categoryType = rawDocument.categoryType;
  this.categoryName = rawDocument.categoryName;
  this.location = rawDocument.location;
  this.documentId = rawDocument.documentId ?? applicationContext.getUniqueId();
  this.description = rawDocument.description;
  this.fileName = rawDocument.fileName;
};

Document.VALIDATION_ERROR_MESSAGES = {
  categoryName: 'Enter a category name',
  categoryType: 'Enter a category type',
  location: 'Enter a location',
};

Document.schema = joi.object().keys({
  categoryName: JoiValidationConstants.STRING.required(),
  categoryType: JoiValidationConstants.STRING.valid(
    ...Object.values(PRACTITIONER_DOCUMENT_TYPES),
  ).required(),
  description: JoiValidationConstants.STRING.optional(),
  documentId: JoiValidationConstants.UUID.required().description(
    'System-generated unique ID for the documents. If the document is associated with a document in S3, this is also the S3 document key.',
  ),
  fileName: JoiValidationConstants.STRING.optional(),
  location: JoiValidationConstants.STRING.when('categoryType', {
    is: PRACTITIONER_DOCUMENT_TYPES_MAP.CERTIFICATE_OF_GOOD_STANDING,
    otherwise: joi.optional().allow(null),
    then: joi.required(),
  }),
});

joiValidationDecorator(
  Document,
  Document.schema,
  Document.VALIDATION_ERROR_MESSAGES,
);

module.exports = { Document: validEntityDecorator(Document) };
