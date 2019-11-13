const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { replaceBracketed } = require('../../utilities/replaceBracketed');

/**
 *
 * @param {object} rawProps the raw document data
 * @constructor
 */
function CourtIssuedDocumentTypeC(rawProps) {
  this.attachments = rawProps.attachments;
  this.documentTitle = rawProps.documentTitle;
  this.documentType = rawProps.documentType;
  this.docketNumbers = rawProps.docketNumbers;
}

CourtIssuedDocumentTypeC.prototype.getDocumentTitle = function() {
  return replaceBracketed(this.documentTitle, this.docketNumbers);
};

CourtIssuedDocumentTypeC.VALIDATION_ERROR_MESSAGES = {
  attachments: 'Enter selection for Attachments',
  date: [
    {
      contains: 'must be less than or equal to',
      message: 'Enter a valid date',
    },
    'Enter a date',
  ],
  docketNumbers: 'Enter docket number(s)',
  documentType: 'Select a document type',
  freeText: 'Enter a description',
  judge: 'Select a judge',
};

CourtIssuedDocumentTypeC.schema = {
  attachments: joi.boolean().required(),
  docketNumbers: joi.string().required(),
  documentTitle: joi.string().optional(),
  documentType: joi.string().required(),
};

joiValidationDecorator(
  CourtIssuedDocumentTypeC,
  CourtIssuedDocumentTypeC.schema,
  undefined,
  CourtIssuedDocumentTypeC.VALIDATION_ERROR_MESSAGES,
);

module.exports = { CourtIssuedDocumentTypeC };
