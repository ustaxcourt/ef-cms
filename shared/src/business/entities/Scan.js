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

Scan.name = 'Scan';

Scan.prototype.addBatch = function() {};

module.exports = { Scan };
