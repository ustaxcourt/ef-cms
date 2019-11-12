const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { formatDateString } = require('../../utilities/DateHandler');
const { replaceBracketed } = require('../../utilities/replaceBracketed');

/**
 *
 * @param {object} rawProps the raw document data
 * @constructor
 */
function CourtIssuedDocumentTypeD(rawProps) {
  this.attachments = rawProps.attachments;
  this.date = rawProps.date;
  this.documentTitle = rawProps.documentTitle;
  this.documentType = rawProps.documentType;
  this.freeText = rawProps.freeText;
}

CourtIssuedDocumentTypeD.prototype.getDocumentTitle = function() {
  return replaceBracketed(
    this.documentTitle,
    formatDateString(this.date, 'MM-DD-YYYY'),
    this.freeText,
  );
};

CourtIssuedDocumentTypeD.VALIDATION_ERROR_MESSAGES = {
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

CourtIssuedDocumentTypeD.schema = {
  attachments: joi.boolean().required(),
  date: joi
    .date()
    .iso()
    .max('now')
    .required(),
  documentTitle: joi.string().optional(),
  documentType: joi.string().required(),
  freeText: joi.string().required(),
};

joiValidationDecorator(
  CourtIssuedDocumentTypeD,
  CourtIssuedDocumentTypeD.schema,
  undefined,
  CourtIssuedDocumentTypeD.VALIDATION_ERROR_MESSAGES,
);

module.exports = { CourtIssuedDocumentTypeD };
