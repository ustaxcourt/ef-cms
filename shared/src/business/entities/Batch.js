const joi = require('joi-browser');
const uuid = require('uuid');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');

/**
 * constructor
 * @param rawBatch
 * @constructor
 */
function Batch(rawBatch) {
  this.batchId = rawBatch.batchId || uuid.v4();
  this.batchIndex = rawBatch.batchIndex || 0;
  this.createdAt = rawBatch.createdAt || new Date().toISOString();
  this.pages = rawBatch.pages || [];
}

Batch.validationName = 'Batch';

/**
 * adds a page to current Batch
 *
 * @param {object} page
 * @returns {Batch}

 */
Batch.prototype.addPage = function(page) {
  this.pages.push(page);
  return this;
};

/**
 * clears all pages within this Batch
 *
 * @returns {Batch}
 */
Batch.prototype.clear = function() {
  this.pages = [];
  return this;
};

Batch.errorToMessageMap = {
  batchIndex: 'Invalid batch index',
  pages: 'At least one page is required',
};

Batch.schema = joi.object().keys({
  batchId: joi
    .string()
    .uuid({
      version: ['uuidv4'],
    })
    .required(),
  batchIndex: joi
    .number()
    .integer()
    .min(0)
    .required(),
  pages: joi
    .array()
    .min(1)
    .required(),
});

joiValidationDecorator(Batch, Batch.schema, undefined, Batch.errorToMessageMap);

module.exports = { Batch };
