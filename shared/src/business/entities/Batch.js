const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');

/**
 * constructor
 * @param rawBatch
 * @constructor
 */
function Batch({ applicationContext, rawBatch }) {
  Object.assign(this, rawBatch, {
    applicationContext,
    batchId: rawBatch.batchId || applicationContext.getUniqueId(),
    batchIndex: rawBatch.batchIndex || 0,
    createdAt: rawBatch.createdAt || new Date().toISOString(),
    pages: rawBatch.pages || [],
  });
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
  createdAt: joi
    .date()
    .iso()
    .required(),
  pages: joi
    .array()
    .min(1)
    .required(),
});

joiValidationDecorator(Batch, Batch.schema, undefined, Batch.errorToMessageMap);

module.exports = { Batch };
