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
function CourtIssuedDocumentNonStandardB(rawProps) {
  this.attachments = rawProps.attachments;
  this.documentTitle = rawProps.documentTitle;
  this.documentType = rawProps.documentType;
  this.freeText = rawProps.freeText;
  this.judge = rawProps.judge;
}

CourtIssuedDocumentNonStandardB.prototype.getDocumentTitle = function() {
  return replaceBracketed(this.documentTitle, this.judge, this.freeText);
};

CourtIssuedDocumentNonStandardB.VALIDATION_ERROR_MESSAGES = {
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

CourtIssuedDocumentNonStandardB.schema = {
  attachments: joi.boolean().required(),
  documentTitle: joi.string().optional(),
  documentType: joi.string().required(),
  freeText: joi.string().required(),
  judge: joi.string().required(),
};

joiValidationDecorator(
  CourtIssuedDocumentNonStandardB,
  CourtIssuedDocumentNonStandardB.schema,
  undefined,
  CourtIssuedDocumentNonStandardB.VALIDATION_ERROR_MESSAGES,
);

module.exports = { CourtIssuedDocumentNonStandardB };
