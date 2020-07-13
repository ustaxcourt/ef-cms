const joi = require('@hapi/joi');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { createISODateString } = require('../utilities/DateHandler');
const { getTimestampSchema } = require('../../utilities/dateSchema');
const joiStrictTimestamp = getTimestampSchema();

/**
 * @param {object} rawProps the raw document data
 * @constructor
 */
function Correspondence(rawProps) {
  this.documentTitle = rawProps.documentTitle;
  this.documentId = rawProps.documentId;
  this.filedBy = rawProps.filedBy;
  this.userId = rawProps.userId;
  this.filingDate = rawProps.filingDate || createISODateString();
}

Correspondence.schema = {
  documentId: joi
    .string()
    .uuid({
      version: ['uuidv4'],
    })
    .required(),
  documentTitle: joi.string().max(500).required(),
  filedBy: joi.string().max(500).allow('').optional(),
  filingDate: joiStrictTimestamp
    .max('now')
    .required()
    .description('Date that this Document was filed.'),
  userId: joi
    .string()
    .uuid({
      version: ['uuidv4'],
    })
    .required(),
};

joiValidationDecorator(Correspondence, Correspondence.schema, {});

module.exports = { Correspondence };
