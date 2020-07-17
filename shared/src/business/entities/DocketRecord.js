const joi = require('@hapi/joi');
const {
  JoiValidationConstants,
} = require('../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { ALL_EVENT_CODES, SERVED_PARTIES_CODES } = require('./EntityConstants');

/**
 * DocketRecord constructor
 *
 * @param {object} rawDocketRecord the raw docket record data
 * @constructor
 */
function DocketRecord(rawDocketRecord, { applicationContext }) {
  if (!applicationContext) {
    throw new TypeError('applicationContext must be defined');
  }
  this.entityName = 'DocketRecord';

  this.docketRecordId =
    rawDocketRecord.docketRecordId || applicationContext.getUniqueId();
  this.action = rawDocketRecord.action;
  this.description = rawDocketRecord.description;
  this.documentId = rawDocketRecord.documentId;
  this.editState = rawDocketRecord.editState;
  this.eventCode = rawDocketRecord.eventCode;
  this.numberOfPages = rawDocketRecord.numberOfPages;
  this.filedBy = rawDocketRecord.filedBy;
  this.filingDate = rawDocketRecord.filingDate;
  this.index = rawDocketRecord.index;
  this.servedPartiesCode = rawDocketRecord.servedPartiesCode;
  this.isLegacy = rawDocketRecord.isLegacy;
  this.isStricken = rawDocketRecord.isStricken;
}

DocketRecord.validationName = 'DocketRecord';

DocketRecord.VALIDATION_ERROR_MESSAGES = {
  description: 'Enter a description',
  eventCode: 'Enter an event code',
  filingDate: 'Enter a valid filing date',
  index: 'Enter an index',
};

joiValidationDecorator(
  DocketRecord,
  joi.object().keys({
    action: joi
      .string()
      .max(100)
      .optional()
      .allow(null)
      .description('Action taken in response to this Docket Record item.'),
    description: joi
      .string()
      .max(500)
      .required()
      .description(
        'Text that describes this Docket Record item, which may be part of the Filings and Proceedings value.',
      ),
    documentId: JoiValidationConstants.UUID.allow(null)
      .optional()
      .description('ID of the associated PDF document in the S3 bucket.'),
    editState: joi
      .string()
      .max(3000)
      .allow(null)
      .optional()
      .meta({ tags: ['Restricted'] })
      .description('JSON representation of the in-progress edit of this item.'),
    entityName: joi.string().valid('DocketRecord').required(),
    eventCode: joi
      .string()
      .valid(...ALL_EVENT_CODES)
      .required()
      .description(
        'Code associated with the event that resulted in this item being added to the Docket Record.',
      ),
    filedBy: joi
      .string()
      .max(500)
      .optional()
      .allow(null)
      .meta({ tags: ['Restricted'] })
      .description('User that filed this Docket Record item.'),
    filingDate: JoiValidationConstants.ISO_DATE.max('now')
      .required()
      .description('Date that this Docket Record item was filed.'),
    index: joi
      .number()
      .integer()
      .required()
      .description('Index of this item in the Docket Record list.'),
    isLegacy: joi
      .boolean()
      .optional()
      .description(
        'Indicates whether or not the DocketRecord belongs to a legacy case that has been migrated to the new system.',
      ),
    isStricken: joi
      .boolean()
      .when('isLegacy', {
        is: true,
        otherwise: joi.optional(),
        then: joi.required(),
      })
      .description(
        'Indicates the item has been removed from the docket record.',
      ),
    numberOfPages: joi.number().optional().allow(null),
    servedPartiesCode: joi
      .string()
      .valid(...SERVED_PARTIES_CODES)
      .allow(null)
      .optional()
      .description('Served parties code to override system-computed code.'),
  }),
  DocketRecord.VALIDATION_ERROR_MESSAGES,
);

DocketRecord.prototype.setNumberOfPages = function (numberOfPages) {
  this.numberOfPages = numberOfPages;
};

module.exports = { DocketRecord };
