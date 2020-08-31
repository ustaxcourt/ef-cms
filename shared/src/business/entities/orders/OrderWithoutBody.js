const joi = require('joi');
const {
  JoiValidationConstants,
} = require('../../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { ALL_DOCUMENT_TYPES, ALL_EVENT_CODES } = require('../EntityConstants');
const { Order } = require('./Order');

/**
 * @param {object} rawOrder the raw order data
 * @constructor
 */
function OrderWithoutBody() {}

OrderWithoutBody.prototype.init = function init(rawOrder) {
  this.documentTitle = rawOrder.documentTitle;
  this.documentType = rawOrder.documentType;
  this.eventCode = rawOrder.eventCode;
};

OrderWithoutBody.VALIDATION_ERROR_MESSAGES = {
  ...Order.VALIDATION_ERROR_MESSAGES,
};

joiValidationDecorator(
  OrderWithoutBody,
  joi.object().keys({
    documentTitle: JoiValidationConstants.STRING.max(100).required(),
    documentType: JoiValidationConstants.STRING.valid(
      ...ALL_DOCUMENT_TYPES,
    ).required(),
    eventCode: JoiValidationConstants.STRING.valid(
      ...ALL_EVENT_CODES,
    ).required(),
  }),
  OrderWithoutBody.VALIDATION_ERROR_MESSAGES,
);

module.exports = { OrderWithoutBody: validEntityDecorator(OrderWithoutBody) };
