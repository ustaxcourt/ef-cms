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
function CourtIssuedDocumentNonStandardE(rawProps) {
  this.attachments = rawProps.attachments;
  this.date = rawProps.date;
  this.documentTitle = rawProps.documentTitle;
  this.documentType = rawProps.documentType;
}

CourtIssuedDocumentNonStandardE.prototype.getDocumentTitle = function() {
  return replaceBracketed(
    this.documentTitle,
    formatDateString(this.date, 'MM-DD-YYYY'),
  );
};

CourtIssuedDocumentNonStandardE.VALIDATION_ERROR_MESSAGES = {
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

CourtIssuedDocumentNonStandardE.schema = {
  attachments: joi.boolean().required(),
  date: joi
    .date()
    .iso()
    .max('now')
    .required(),
  documentTitle: joi.string().optional(),
  documentType: joi.string().required(),
};

joiValidationDecorator(
  CourtIssuedDocumentNonStandardE,
  CourtIssuedDocumentNonStandardE.schema,
  undefined,
  CourtIssuedDocumentNonStandardE.VALIDATION_ERROR_MESSAGES,
);

module.exports = { CourtIssuedDocumentNonStandardE };
