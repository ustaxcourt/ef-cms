const joi = require('joi');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../JoiValidationDecorator');
const { ALL_DOCUMENT_TYPES, ALL_EVENT_CODES } = require('../EntityConstants');
const { JoiValidationConstants } = require('../JoiValidationConstants');

/**
 * @param {object} rawOrder the raw order data
 * @constructor
 */
function Order() {}

Order.prototype.init = function init(rawOrder) {
  this.documentTitle = rawOrder.documentTitle;
  this.documentType = rawOrder.documentType;
  this.orderBody = rawOrder.orderBody;
};

Order.VALIDATION_ERROR_MESSAGES = {
  documentTitle: [
    { contains: 'is required', message: 'Enter the title of this order' },
    {
      contains: 'must be less than or equal to',
      message: 'Limit is 100 characters. Enter 100 or fewer characters.',
    },
  ],
  documentType: 'Select an order type',
  eventCode: 'Select an order type',
  orderBody: 'Order body is required.',
};

Order.VALIDATION_RULES = {
  documentTitle: JoiValidationConstants.STRING.max(100).required(),
  documentType: JoiValidationConstants.STRING.valid(
    ...ALL_DOCUMENT_TYPES,
  ).required(),
  eventCode: JoiValidationConstants.STRING.valid(...ALL_EVENT_CODES).optional(),
  orderBody: JoiValidationConstants.STRING.max(500).required(),
};

joiValidationDecorator(
  Order,
  joi.object().keys(Order.VALIDATION_RULES),
  Order.VALIDATION_ERROR_MESSAGES,
);

module.exports = { Order: validEntityDecorator(Order) };
