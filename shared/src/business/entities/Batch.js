const joi = require('@hapi/joi');
const {
  JoiValidationConstants,
} = require('../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { createISODateString } = require('../utilities/DateHandler');
/**
 * constructor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.rawBatch the raw batch data
 * @constructor
 */
function Batch({ applicationContext, rawBatch }) {
  this.batchId = rawBatch.batchId || applicationContext.getUniqueId();
  this.batchIndex = rawBatch.batchIndex || 0;
  this.createdAt = rawBatch.createdAt || createISODateString();
  this.pages = rawBatch.pages || [];
}

Batch.validationName = 'Batch';

/**
 * adds a page to current Batch
 *
 * @param {object} page the page to add
 * @returns {Batch} the batch entity after the page is added

 */
Batch.prototype.addPage = function (page) {
  this.pages.push(page);
  return this;
};

/**
 * clears all pages within this Batch
 *
 * @returns {Batch} the batch entity after the pages are cleared
 */
Batch.prototype.clear = function () {
  this.pages = [];
  return this;
};

Batch.VALIDATION_ERROR_MESSAGES = {
  batchIndex: 'Invalid batch index',
  pages: 'At least one page is required',
};

Batch.schema = joi.object().keys({
  batchId: JoiValidationConstants.UUID.required(),
  batchIndex: joi.number().integer().min(0).required(),
  createdAt: JoiValidationConstants.ISO_DATE.required(),
  pages: joi.array().min(1).required(),
});

joiValidationDecorator(Batch, Batch.schema, Batch.VALIDATION_ERROR_MESSAGES);

module.exports = { Batch };
