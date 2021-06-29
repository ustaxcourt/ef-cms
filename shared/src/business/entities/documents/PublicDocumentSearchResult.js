const joi = require('joi');
const {
  JoiValidationConstants,
} = require('../../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const {
  OPINION_EVENT_CODES_WITH_BENCH_OPINION,
} = require('../../entities/EntityConstants');
const { pick } = require('lodash');

PublicDocumentSearchResult.DOCUMENT_SEARCH_PAGE_LOAD_SIZE = 6;

/**
 * Public Document Search Result entity
 *
 * @param {object} rawProps the raw document search result data
 * @constructor
 */
function PublicDocumentSearchResult() {
  this.entityName = 'PublicDocumentSearchResult';
}

PublicDocumentSearchResult.prototype.init = function init(rawProps = {}) {
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
    'isStricken',
    'judge',
    'numberOfPages',
    'sealedDate',
    'signedJudgeName',
  ];
  Object.assign(this, pick(rawProps, propNames));
};

PublicDocumentSearchResult.VALIDATION_ERROR_MESSAGES = {
  eventCode:
    'Sealed documents cannot be returned in public searches unless they are of type opinion',
  isStricken: 'Stricken documents cannot be returned in public searches.',
};

PublicDocumentSearchResult.schema = joi.object().keys({
  caseCaption:
    JoiValidationConstants.STRING.description('The case caption').required(),
  docketEntryId: JoiValidationConstants.UUID.description(
    'The UUID of the corresponding document in S3',
  ).required(),
  docketNumber: JoiValidationConstants.DOCKET_NUMBER.required(),
  docketNumberWithSuffix: JoiValidationConstants.STRING,
  documentTitle: JoiValidationConstants.DOCUMENT_TITLE.required(),
  documentType: JoiValidationConstants.STRING,
  eventCode: joi.when('isSealed', {
    is: true,
    otherwise: JoiValidationConstants.STRING,
    then: JoiValidationConstants.STRING.valid(
      ...OPINION_EVENT_CODES_WITH_BENCH_OPINION,
    ),
  }),
  isSealed: joi.boolean(),
  isStricken: joi.boolean().invalid(true),
  judge: JoiValidationConstants.STRING.optional(),
  numberOfPages: joi.number().integer(),
  sealedDate: JoiValidationConstants.ISO_DATE,
  signedJudgeName: JoiValidationConstants.STRING.optional(),
});

joiValidationDecorator(
  PublicDocumentSearchResult,
  PublicDocumentSearchResult.schema,
  PublicDocumentSearchResult.VALIDATION_ERROR_MESSAGES,
);

exports.PublicDocumentSearchResult = validEntityDecorator(
  PublicDocumentSearchResult,
);
