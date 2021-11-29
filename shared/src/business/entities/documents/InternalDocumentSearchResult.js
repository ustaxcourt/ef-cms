const joi = require('joi');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../JoiValidationDecorator');
const { JoiValidationConstants } = require('../JoiValidationConstants');
const { ORDER_JUDGE_FIELD } = require('../EntityConstants');
const { pick } = require('lodash');

InternalDocumentSearchResult.DOCUMENT_SEARCH_PAGE_LOAD_SIZE = 6;

/**
 * Public Document Search Result entity
 *
 * @param {object} rawProps the raw document search result data
 * @constructor
 */
function InternalDocumentSearchResult() {
  this.entityName = 'InternalDocumentSearchResult';
}

InternalDocumentSearchResult.prototype.init = function init(rawProps = {}) {
  const propNames = [
    'caseCaption',
    'docketEntryId',
    'docketNumber',
    'docketNumberWithSuffix',
    'documentTitle',
    'documentType',
    'eventCode',
    'filingDate',
    'isSealed',
    'isFileAttached',
    'isStricken',
    'judge',
    'numberOfPages',
    'sealedDate',
    ORDER_JUDGE_FIELD,
  ];
  Object.assign(this, pick(rawProps, propNames));
};

InternalDocumentSearchResult.VALIDATION_ERROR_MESSAGES = {};

InternalDocumentSearchResult.schema = joi.object().keys({
  caseCaption:
    JoiValidationConstants.STRING.description('The case caption').required(),
  docketEntryId: JoiValidationConstants.UUID.description(
    'The UUID of the corresponding document in S3',
  ).required(),
  docketNumber: JoiValidationConstants.DOCKET_NUMBER.required(),
  docketNumberWithSuffix: JoiValidationConstants.STRING,
  documentTitle: JoiValidationConstants.DOCUMENT_TITLE.required(),
  documentType: JoiValidationConstants.STRING,
  eventCode: JoiValidationConstants.STRING,
  isFileAttached: joi.boolean(),
  isSealed: joi.boolean(),
  isStricken: joi.boolean(),
  judge: JoiValidationConstants.STRING.optional().allow(null),
  numberOfPages: joi.number().integer().optional().allow(null),
  sealedDate: JoiValidationConstants.ISO_DATE,
  signedJudgeName: JoiValidationConstants.STRING.optional().allow(null),
});

joiValidationDecorator(
  InternalDocumentSearchResult,
  InternalDocumentSearchResult.schema,
  InternalDocumentSearchResult.VALIDATION_ERROR_MESSAGES,
);

exports.InternalDocumentSearchResult = validEntityDecorator(
  InternalDocumentSearchResult,
);
