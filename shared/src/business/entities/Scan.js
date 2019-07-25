const _ = require('lodash');
const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');

/**
 * constructor
 * @param rawScan
 * @constructor
 */
function Scan({ applicationContext, rawScan }) {
  Object.assign(this, rawScan, {
    batches: rawScan.batches || [],
    createdAt: rawScan.createdAt || new Date().toISOString(),
    scanId: rawScan.scanId || applicationContext.getUniqueId(),
  });
}

Scan.validationName = 'Scan';

/**
 * adds a batch to the current scan
 *
 * @param {Batch} batch Batch entity
 * @returns {Scan} Scan entity
 */
Scan.prototype.addBatch = function(batch) {
  this.batches.push(batch);
  return this;
};

/**
 * removes a batch from the current scan
 *
 * @param {Batch} batchEntity Batch entity to remove
 * @returns {Scan} Scan entity
 */
Scan.prototype.removeBatch = function(batchEntity) {
  const { batchId } = batchEntity;

  this.batches = _.remove(this.batches, batch => batchId === batch.batchId);

  return this;
};

Scan.errorToMessageMap = {
  batches: 'Invalid batch index',
  pages: 'At least one page is required',
};

Scan.schema = joi.object().keys({
  createdAt: joi
    .date()
    .iso()
    .required(),
  pages: joi
    .array()
    .min(1)
    .required(),
  scanId: joi
    .string()
    .uuid({
      version: ['uuidv4'],
    })
    .required(),
});

joiValidationDecorator(Scan, Scan.schema, undefined, Scan.errorToMessageMap);

module.exports = { Scan };
