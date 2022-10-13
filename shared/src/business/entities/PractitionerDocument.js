const joi = require('joi');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('./JoiValidationDecorator');
const {
  PRACTITIONER_DOCUMENT_TYPES,
  PRACTITIONER_DOCUMENT_TYPES_MAP,
} = require('./EntityConstants');
const { createISODateString } = require('../utilities/DateHandler');
const { JoiValidationConstants } = require('./JoiValidationConstants');

/**
 * constructor
 *
 * @param {object} providers the providers object
 * @param {object} providers.rawStamp the raw document data
 * @constructor
 */
function PractitionerDocument() {
  this.entityName = 'Document';
}

PractitionerDocument.prototype.init = function init(
  rawDocument,
  { applicationContext },
) {
  this.categoryType = rawDocument.categoryType;
  this.categoryName = rawDocument.categoryName;
  this.location = rawDocument.location;
  this.practitionerDocumentFileId =
    rawDocument.practitionerDocumentFileId ?? applicationContext.getUniqueId();
  this.description = rawDocument.description;
  this.fileName = rawDocument.fileName;
  this.uploadDate = rawDocument.uploadDate || createISODateString();
};

PractitionerDocument.VALIDATION_ERROR_MESSAGES = {
  categoryName: 'Enter a category name',
  categoryType: 'Enter a category type',
  location: 'Enter a location',
};

PractitionerDocument.schema = joi.object().keys({
  categoryName: JoiValidationConstants.STRING.required(),
  categoryType: JoiValidationConstants.STRING.valid(
    ...Object.values(PRACTITIONER_DOCUMENT_TYPES),
  ).required(),
  description: JoiValidationConstants.STRING.optional(),
  practitionerDocumentFileId:
    JoiValidationConstants.UUID.required().description(
      'System-generated unique ID for the documents. If the document is associated with a document in S3, this is also the S3 document key.',
    ),
  fileName: JoiValidationConstants.STRING.required(),
  location: JoiValidationConstants.STRING.when('categoryType', {
    is: PRACTITIONER_DOCUMENT_TYPES_MAP.CERTIFICATE_OF_GOOD_STANDING,
    otherwise: joi.optional().allow(null),
    then: joi.required(),
  }),
  uploadDate: JoiValidationConstants.ISO_DATE,
});

joiValidationDecorator(
  PractitionerDocument,
  PractitionerDocument.schema,
  PractitionerDocument.VALIDATION_ERROR_MESSAGES,
);

module.exports = {
  PractitionerDocument: validEntityDecorator(PractitionerDocument),
};
